using Newtonsoft.Json;
using System.Text;
using System.Text.Json.Nodes;
using static Helpers.RAGHelper;

namespace Helpers
{
    public static class QwenHelper
    {
        private static readonly HttpClient _httpClient = new HttpClient();

        public static async IAsyncEnumerable<string> Prompt(string id, string query, bool? rag, List<string[]>? history)
        {
            using var requestMessage = new HttpRequestMessage(HttpMethod.Post, Environment.GetEnvironmentVariable("QWEN_URL"))
            {
                Content = new StringContent(JsonConvert.SerializeObject(new
                {
                    Id = id,
                    Query = query,
                    History = history,
                    Rag = rag ?? false,
                }), Encoding.UTF8, "application/json")
            };

            using var response = await _httpClient.SendAsync(requestMessage, HttpCompletionOption.ResponseHeadersRead);

            var stream = await response.Content.ReadAsStreamAsync();
            using var reader = new StreamReader(stream, Encoding.UTF8);

            string generatedText = "";

            char[] buffer = new char[1024];
            while (!reader.EndOfStream)
            {
                int readCount = await reader.ReadAsync(buffer, 0, buffer.Length);
                if (readCount > 0)
                {
                    var chunk = new string(buffer, 0, readCount);
                    generatedText += chunk;

                    yield return chunk;
                }
            }
            reader.Close();
        }

        public static async Task<Document[]> GetRagDocuments(string id)
        {
            HttpResponseMessage res = await _httpClient.GetAsync($"{Environment.GetEnvironmentVariable("QWEN_URL")}/rag-doc?id={id}");

            if (!res.IsSuccessStatusCode)
                return Array.Empty<Document>();

            string jsonResponse = await res.Content.ReadAsStringAsync();
            var response = JsonConvert.DeserializeObject<List<Document>>(jsonResponse);

            return response?.ToArray() ?? Array.Empty<Document>();
        }

        public static async Task DeleteHistory(string id)
        {
            await _httpClient.GetAsync($"{Environment.GetEnvironmentVariable("QWEN_URL")}/del-history?id={id}");
            await _httpClient.GetAsync($"{Environment.GetEnvironmentVariable("QWEN_URL")}/del-rag-doc?id={id}");
        }
    }
}
