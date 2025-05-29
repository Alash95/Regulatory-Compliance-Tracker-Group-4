public static class ScraperConfig
{
    public static Dictionary<string, string> Websites => new()
    {
        { "CBN", "https://www.cbn.gov.ng/Regulations/" },
        { "SEC", "https://www.sec.gov.ng/" },
        { "NDIC", "https://ndic.gov.ng/" }
    };
}