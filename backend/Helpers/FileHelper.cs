namespace Helpers
{
    public class FileHelper
    {
        public static readonly string UploadDirectory = "Uploads";

        public static string? SaveFileAndGetPath(IFormFile? file)
        {
            if (file == null)
                return null;

            var filePath = $"{UploadDirectory}\\{Guid.NewGuid()}_{file.FileName}";

            using var stream = new FileStream(filePath, FileMode.Create);
            file.CopyTo(stream);

            return filePath;
        }

        public static IFormFile? CreateFormFile(string? path)
        {
            if (string.IsNullOrEmpty(path))
                return null;
                
            var filePath = $"{UploadDirectory}\\{path}";
            var fileInfo = new FileInfo(filePath);
            var stream = new FileStream(filePath, FileMode.Open, FileAccess.Read);
            return new FormFile(stream, 0, fileInfo.Length, fileInfo.Name, fileInfo.Name);
        }
    }
}