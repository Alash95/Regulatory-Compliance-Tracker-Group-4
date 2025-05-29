using Azure.Storage.Blobs;
using System.IO;
using System.Text;
using System.Threading.Tasks;

namespace ComplianceFunctionApp.Services
{
    public class AzureBlobUploader
    {
        private readonly BlobContainerClient _container;

        public AzureBlobUploader(string connectionString, string containerName)
        {
            _container = new BlobContainerClient(connectionString, containerName);
            _container.CreateIfNotExists();
        }

        public async Task UploadTextAsync(string blobName, string content)
        {
            var blob = _container.GetBlobClient(blobName);
            using var stream = new MemoryStream(Encoding.UTF8.GetBytes(content));
            await blob.UploadAsync(stream, overwrite: true);
        }
    }
}
