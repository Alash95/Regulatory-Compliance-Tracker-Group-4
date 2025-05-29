using Microsoft.Extensions.Logging;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Azure.Functions.Worker.Extensions.Timer;


public class ScraperTimerTrigger
{
    private readonly MainScraperRunner _runner;
    private readonly ILogger _logger;

    public ScraperTimerTrigger(MainScraperRunner runner, ILoggerFactory loggerFactory)
    {
        _runner = runner;
        _logger = loggerFactory.CreateLogger<ScraperTimerTrigger>();
    }

    [Function("ScraperTimerTrigger")]
    public async Task Run([TimerTrigger("0 */5 * * * *")] TimerInfo myTimer)
    {
        _logger.LogInformation($"✅ Timer triggered at: {DateTime.UtcNow}");
        await _runner.RunAsync();
    }
}
