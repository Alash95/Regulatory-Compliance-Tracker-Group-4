public class RegulatoryContentScraper
{
    public async Task<List<Dictionary<string, string>>> ScrapeWebsite(string siteName)
    {
        // Placeholder: pretend we scraped something
        await Task.Delay(200); // simulate network delay
        return new List<Dictionary<string, string>> {
            new() { { "title", $"Sample content from {siteName}" }, { "body", "This is dummy content." } }
        };
    }
}