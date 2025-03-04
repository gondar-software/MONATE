using Helpers;
using System.Text;

namespace Middlewares
{
    public class CryptionMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly CryptionHelper _cryptionHelper;

        public CryptionMiddleware(RequestDelegate next, CryptionHelper cryptionHelper)
        {
            _next = next;
            _cryptionHelper = cryptionHelper;
        }

        async Task ImplementEncryption(HttpContext context)
        {
            if (context.Request.ContentType?.Contains("application/json") == true && context.Request.ContentLength > 0)
            {
                using var reader = new StreamReader(context.Request.Body);
                var encryptedBody = await reader.ReadToEndAsync();
                encryptedBody = encryptedBody.Replace("\"", "");
                var decryptedBody = _cryptionHelper.Decrypt(encryptedBody);

                var bytes = Encoding.UTF8.GetBytes(decryptedBody);
                context.Request.Body = new MemoryStream(bytes);
                context.Request.ContentLength = bytes.Length;
            }

            var originalBodyStream = context.Response.Body;
            using var responseBody = new MemoryStream();
            context.Response.Body = responseBody;

            await _next(context);

            if (context.Response.ContentType?.Contains("application/json") == true)
            {
                context.Response.Body.Seek(0, SeekOrigin.Begin);
                var plainTextResponse = await new StreamReader(context.Response.Body).ReadToEndAsync();
                var encryptedResponse = _cryptionHelper.Encrypt(plainTextResponse);

                var encryptedBytes = Encoding.UTF8.GetBytes(encryptedResponse);
                context.Response.Body = originalBodyStream;
                context.Response.ContentLength = encryptedBytes.Length;
                await context.Response.Body.WriteAsync(encryptedBytes, 0, encryptedBytes.Length);
            }
        }

        public Task InvokeAsync(HttpContext context)
        {
            if (context.Request.Path.Value?.IndexOf("api/chatbot/prompt") > -1)
            {
                Console.WriteLine("Success");
                return _next(context);
            }
            else
            {
                return ImplementEncryption(context);
            }
        }
    }
}
