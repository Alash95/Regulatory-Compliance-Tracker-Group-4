using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;
using System.Text;
using Microsoft.Extensions.Configuration;


public class AzureStorage
{
    private readonly BlobServiceClient _blobServiceClient;

    public AzureStorage(IConfiguration config)
    {
        string connectionString = config["AzureWebJobsStorage"];
        _blobServiceClient = new BlobServiceClient(connectionString);
    }

    public async Task<bool> StoreContentToBlob(string containerName, string blobName, string content)
    {
        try
        {
            var containerClient = _blobServiceClient.GetBlobContainerClient(containerName);
            await containerClient.CreateIfNotExistsAsync(PublicAccessType.None);

            var blobClient = containerClient.GetBlobClient(blobName);
            using var stream = new MemoryStream(Encoding.UTF8.GetBytes(content));

            await blobClient.UploadAsync(stream, overwrite: true);
            return true;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"❌ Blob storage error: {ex.Message}");
            return false;
        }
    }
}
