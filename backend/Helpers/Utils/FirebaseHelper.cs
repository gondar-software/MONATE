using Enums;
using Google.Apis.Auth.OAuth2;
using Google.Cloud.Storage.V1;

namespace Helpers.Utils
{
    public static class FirebaseHelper
    {
        private readonly static StorageClient _client = StorageClient.Create(
            GoogleCredential.FromFile("firebase.json"));

        public static async Task<string?> SaveFileAndGetPath(IFormFile? file, FileType type)
        {
            if (file == null || file.Length == 0)
                return null;

            var filePath = $"{type}/{Guid.NewGuid()}_{file.FileName}";
            using (var stream = file.OpenReadStream())
            {
                await _client.UploadObjectAsync(
                    Environment.GetEnvironmentVariable("FIREBASE_BACKET_NAME"),
                    filePath,
                    file.ContentType,
                    stream
                );
            }

            return filePath;
        }

        public static async Task<byte[]?> DownloadFile(string? path)
        {
            if (string.IsNullOrEmpty(path))
                return null;

            using (var memoryStream = new MemoryStream())
            {
                await _client.DownloadObjectAsync(
                    Environment.GetEnvironmentVariable("FIREBASE_BACKET_NAME"),
                    path,
                    memoryStream
                );
                memoryStream.Seek(0, SeekOrigin.Begin);
                return memoryStream.ToArray();
            }
        }
    }
}