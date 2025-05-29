using System;
using System.IO;
using System.Text.Json;
using System.Threading.Tasks;
using Azure.Storage.Blobs;
using Microsoft.Extensions.Logging;
using ComplianceFunctionApp.Models;
using ComplianceFunctionApp.Services;
using ComplianceFunctionApp.Utils;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Azure.Functions.Worker.Extensions.Timer;



namespace ComplianceFunctionApp.Functions
{
    public class AnalyzerFunction
    {
        private readonly ILogger _logger;
        private readonly OpenAISummarizer _summarizer;
        private readonly OpenAIClassifier _classifier;
        private readonly AzureBlobUploader _blobUploader;

        public AnalyzerFunction(
            ILoggerFactory loggerFactory,
            OpenAISummarizer summarizer,
            OpenAIClassifier classifier,
            AzureBlobUploader blobUploader)
        {
            _logger = loggerFactory.CreateLogger<AnalyzerFunction>();
            _summarizer = summarizer;
            _classifier = classifier;
            _blobUploader = blobUploader;
        }

        [Function("AnalyzerFunction")]
        public async Task RunAsync([TimerTrigger("0 */5 * * * *")] TimerInfo myTimer)
        {
            _logger.LogInformation($"⏰ Timer triggered at: {DateTime.UtcNow}");

            var blobServiceClient = new BlobServiceClient(Environment.GetEnvironmentVariable("AzureWebJobsStorage"));
            var containerClient = blobServiceClient.GetBlobContainerClient("regulatory-input");

            await foreach (var blobItem in containerClient.GetBlobsAsync())
            {
                var blobClient = containerClient.GetBlobClient(blobItem.Name);

                _logger.LogInformation($"📄 Processing file: {blobItem.Name}");

                using var stream = await blobClient.OpenReadAsync();
                using var reader = new StreamReader(stream);
                string documentText = await reader.ReadToEndAsync();

                if (string.IsNullOrWhiteSpace(documentText))
                {
                    _logger.LogWarning($"⚠️ Skipped empty document: {blobItem.Name}");
                    continue;
                }

                // Summarize
                _logger.LogInformation("📝 Generating summary...");
                string summary = await _summarizer.SummarizeAsync(documentText);

                // Classify
                _logger.LogInformation("🧠 Running classification...");
                ClassificationResult classification = await _classifier.ClassifyAsync(documentText);
                classification.Summary = summary;

                // Serialize classification result
                string json = JsonSerializer.Serialize(classification, new JsonSerializerOptions { WriteIndented = true });

                // Construct output filenames
                string todayFolder = DateFolderHelper.GetTodayFolder();
                string baseName = Path.GetFileNameWithoutExtension(blobItem.Name);
                string jsonFileName = $"{todayFolder}/{baseName}_CLASSIFICATION.json";
                string summaryFileName = $"{todayFolder}/{baseName}_SUMMARY.txt";

                // Upload to blob
                _logger.LogInformation("📤 Uploading classification and summary...");
                await _blobUploader.UploadTextAsync(jsonFileName, json);
                await _blobUploader.UploadTextAsync(summaryFileName, summary);

                _logger.LogInformation($"✅ Done processing: {blobItem.Name}");
            }

            _logger.LogInformation("🏁 All documents processed.");
        }
    }
}
