using Azure.Storage.Blobs;
using Azure.Storage.Sas;
using System.Text;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Azure.Functions.Worker.Extensions.Timer;
using Microsoft.Extensions.Configuration;



namespace ComplianceFunctionApp.Services
{
    public class AzureBlobService
    {
        private readonly BlobServiceClient _blobClient;
        private readonly string _containerName = "regulatory-data";

        public AzureBlobService(IConfiguration config)
        {
            _blobClient = new BlobServiceClient(config["AzureWebJobsStorage"]);
        }

        public async Task UploadTextAsync(string content, string filename)
        {
            string dateFolder = DateTime.UtcNow.ToString("yyyy-MM-dd");
            var container = _blobClient.GetBlobContainerClient(_containerName);
            await container.CreateIfNotExistsAsync();
            var blob = container.GetBlobClient($"{dateFolder}/{filename}");
            using var stream = new MemoryStream(Encoding.UTF8.GetBytes(content));
            await blob.UploadAsync(stream, overwrite: true);
        }

        public async Task UploadPdfAsync(Stream pdfStream, string filename)
        {
            string dateFolder = DateTime.UtcNow.ToString("yyyy-MM-dd");
            var container = _blobClient.GetBlobContainerClient(_containerName);
            await container.CreateIfNotExistsAsync();
            var blob = container.GetBlobClient($"{dateFolder}/{filename}");
            await blob.UploadAsync(pdfStream, overwrite: true);
        }

        public string GetSasUrl(string blobName)
        {
            var container = _blobClient.GetBlobContainerClient(_containerName);
            var blobClient = container.GetBlobClient(blobName);

            var sasBuilder = new BlobSasBuilder
            {
                BlobContainerName = _containerName,
                BlobName = blobName,
                Resource = "b",
                ExpiresOn = DateTimeOffset.UtcNow.AddHours(1)
            };
            sasBuilder.SetPermissions(BlobSasPermissions.Read);

            return blobClient.GenerateSasUri(sasBuilder).ToString();
        }
    }
}