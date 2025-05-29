using System;
using System.Threading.Tasks;
using Azure;
using Azure.AI.OpenAI;
using Microsoft.Extensions.Configuration;
using System.Collections.Generic;

namespace ComplianceFunctionApp.Services
{
    public class OpenAISummarizer
    {
        private readonly OpenAIClient _client;
        private readonly string _deployment;

        public OpenAISummarizer(IConfiguration config)
        {
            _deployment = config["OpenAI:Deployment"] ?? throw new ArgumentNullException("OpenAI:Deployment configuration is missing");
            var endpoint = config["OpenAI:Endpoint"] ?? throw new ArgumentNullException("OpenAI:Endpoint configuration is missing");
            var key = config["OpenAI:Key"] ?? throw new ArgumentNullException("OpenAI:Key configuration is missing");
            
            _client = new OpenAIClient(
                new Uri(endpoint),
                new AzureKeyCredential(key)
            );
        }

        public async Task<string> SummarizeAsync(string text)
        {
            var messages = new List<ChatRequestMessage>
            {
                new ChatRequestSystemMessage("Summarize this Nigerian regulatory document with bullet points and actionable insights."),
                new ChatRequestUserMessage(text.Substring(0, Math.Min(12000, text.Length)))
            };
            
            var chatCompletionsOptions = new ChatCompletionsOptions(_deployment, messages);

            var response = await _client.GetChatCompletionsAsync(chatCompletionsOptions);
            return response.Value.Choices[0].Message.Content ?? string.Empty;
        }
    }
}