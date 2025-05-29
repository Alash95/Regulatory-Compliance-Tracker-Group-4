using System.Text.Json.Serialization;

namespace ComplianceFunctionApp.Models
{
    public class ClassificationResult
    {
        [JsonPropertyName("category")]
        public string Category { get; set; } = string.Empty;
        
        [JsonPropertyName("riskLevel")]
        public string RiskLevel { get; set; } = string.Empty;
        
        [JsonPropertyName("domain")]
        public string Domain { get; set; } = string.Empty;
        
        [JsonPropertyName("team")]
        public string Team { get; set; } = string.Empty;
        
        [JsonPropertyName("summary")]
        public string Summary { get; set; } = string.Empty;
    }
}