using Microsoft.Extensions.Logging;

public class MainScraperRunner
{
    private readonly RegulatoryContentScraper _scraper;
    private readonly AzureStorage _storage;
    private readonly ILogger _log;

    public MainScraperRunner(RegulatoryContentScraper scraper, AzureStorage storage, ILoggerFactory loggerFactory)
    {
        _scraper = scraper;
        _storage = storage;
        _log = loggerFactory.CreateLogger<MainScraperRunner>();
    }

    public async Task RunAsync()
    {
        try
        {
            foreach (var siteName in ScraperConfig.Websites.Keys)
            {
                _log.LogInformation($"Starting to scrape {siteName}");

                try
                {
                    var results = await _scraper.ScrapeWebsite(siteName);

                    foreach (var content in results)
                    {
                        string title = content["title"];
                        string body = content["body"];
                        string filename = $"{title.Replace(" ", "_")}.txt";

                        if (await _storage.StoreContentToBlob("regulatory-summaries", filename, body))
                            _log.LogInformation($"✅ Saved to blob: {filename}");
                        else
                            _log.LogError($"❌ Failed to save to blob: {filename}");
                    }


                }
                catch (Exception ex)
                {
                    _log.LogError($"Error processing {siteName}: {ex.Message}");
                    continue;
                }
            }
        }
        catch (Exception ex)
        {
            _log.LogCritical($"🚨 Critical error in main process: {ex.Message}");
        }
    }
}