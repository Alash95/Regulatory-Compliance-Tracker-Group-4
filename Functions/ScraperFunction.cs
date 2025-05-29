using Microsoft.Extensions.Logging;
using ComplianceFunctionApp.Services;
using System.Threading.Tasks;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Azure.Functions.Worker.Extensions.Timer;


namespace ComplianceFunctionApp.Functions
{
    public class ScraperFunction
    {
        private readonly AzureBlobService _blobService;

        public ScraperFunction(AzureBlobService blobService)
        {
            _blobService = blobService;
        }

        [Function("ScraperFunction")]
        public async Task Run([TimerTrigger("0 */5 * * * *")] TimerInfo myTimer, FunctionContext context)
        {
            var logger = context.GetLogger("ScraperFunction");
            logger.LogInformation("Scraper function executing...");

            string sampleText = "Summary: CBN issued AML directive requiring Tier 3 verification by June 30.";
            string filename = "CBN_AML_Summary.txt";
            await _blobService.UploadTextAsync(sampleText, filename);

            logger.LogInformation("Saved summary to blob.");

            var url = _blobService.GetSasUrl($"{DateTime.UtcNow:yyyy-MM-dd}/{filename}");
            logger.LogInformation($"SAS URL: {url}");
        }
    }
}