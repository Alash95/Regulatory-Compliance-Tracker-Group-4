using System;
using System.Text.Json;
using System.Threading.Tasks;
using Azure;
using Azure.AI.OpenAI;
using Microsoft.Extensions.Configuration;
using ComplianceFunctionApp.Models;
using System.Collections.Generic;

namespace ComplianceFunctionApp.Services
{
    public class OpenAIClassifier
    {
        private readonly OpenAIClient _client;
        private readonly string _deployment;

        public OpenAIClassifier(IConfiguration config)
        {
            _deployment = config["OpenAI:Deployment"] ?? throw new ArgumentNullException("OpenAI:Deployment configuration is missing");
            var endpoint = config["OpenAI:Endpoint"] ?? throw new ArgumentNullException("OpenAI:Endpoint configuration is missing");
            var key = config["OpenAI:Key"] ?? throw new ArgumentNullException("OpenAI:Key configuration is missing");
            
            _client = new OpenAIClient(
                new Uri(endpoint),
                new AzureKeyCredential(key)
            );
        }

        public async Task<ClassificationResult?> ClassifyAsync(string text)
        {
            string instructions = @"Classify the following regulatory text.
Return the result as JSON with these fields:
{
  ""category"": ""FlaggedAccounts"" | ""PolicyChange"" | ""Deadlines"" | ""RiskAlerts"",
  ""riskLevel"": ""High"" | ""Medium"" | ""Low"",
  ""domain"": ""KYC"" | ""AML"" | ""DataProtection"" | ""Licensing"" | ""General"",
  ""team"": ""Legal"" | ""Finance"" | ""Product"" | ""Compliance""
}";

            var messages = new List<ChatRequestMessage>
            {
                new ChatRequestSystemMessage(instructions),
                new ChatRequestUserMessage(text.Substring(0, Math.Min(12000, text.Length)))
            };

            var options = new ChatCompletionsOptions(_deployment, messages);

            var response = await _client.GetChatCompletionsAsync(options);
            string json = response.Value.Choices[0].Message.Content ?? "{}";

            return JsonSerializer.Deserialize<ClassificationResult>(json);
        }
    }
}