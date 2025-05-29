using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using ComplianceFunctionApp.Services;
using Microsoft.Azure.Functions.Worker.Extensions.OpenApi.Extensions;
using ComplianceFunctionApp.Middleware;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Configuration.Json;
using Microsoft.Extensions.Configuration.EnvironmentVariables;

var host = new HostBuilder()
    .ConfigureFunctionsWorkerDefaults(worker =>
    {
        worker.UseNewtonsoftJson();
        worker.UseMiddleware<ExceptionHandlingMiddleware>(); // optional
    })
    .ConfigureServices(services =>
    {
        services.AddSingleton<OpenAISummarizer>();
        services.AddSingleton<OpenAIClassifier>();
        services.AddSingleton<AzureBlobUploader>();
        services.AddSingleton<AzureBlobService>();

        services.AddHttpClient(); // if needed
    })
    .ConfigureAppConfiguration(config =>
    {
        config.AddJsonFile("appsettings.json", optional: true, reloadOnChange: true);
        config.AddEnvironmentVariables();
    })
    .Build();

host.Run();
