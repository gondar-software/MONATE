using Google.Apis.CustomSearchAPI.v1;
using Google.Apis.Services;
using HtmlAgilityPack;
using OpenAI.Embeddings;

namespace Helpers
{
    public static class RAGHelper
    {
        public class Document
        {
            public string Title { get; set; } = "";
            public string Snippet { get; set; } = "";
            public string Text { get; set; } = "";
            public string Link { get; set; } = "";
            public float[] Embedding { get; set; } = Array.Empty<float>();
            public float Similarity { get; set; }
        }

        private static readonly CustomSearchAPIService _customSearchAPIService;
        private static readonly HttpClient _httpClient;

        static RAGHelper()
        {
            _customSearchAPIService = new CustomSearchAPIService(new BaseClientService.Initializer
            {
                ApiKey = Environment.GetEnvironmentVariable("GOOGLE_API_KEY")
            });
            _httpClient = new HttpClient();
        }

        public static async Task<float[]> GetEmbedding(EmbeddingClient embeddingClient, string document)
        {
            var embeddingResponse = await embeddingClient.GenerateEmbeddingAsync(document);
            return embeddingResponse.Value.ToFloats().ToArray();
        }

        public static async Task<string> ScrapeText(string url)
        {
            try
            {
                var response = await _httpClient.GetAsync(url);
                response.EnsureSuccessStatusCode();
                var htmlContent = await response.Content.ReadAsStringAsync();

                var htmlDocument = new HtmlDocument();
                htmlDocument.LoadHtml(htmlContent);

                var visibleText = htmlDocument.DocumentNode.InnerText;
                return System.Net.WebUtility.HtmlDecode(visibleText).Trim();
            }
            catch (HttpRequestException)
            {
                return string.Empty;
            }
        }

        public static async Task<Document[]> GetRagDocs(EmbeddingClient embeddingClient, string query, int topK = 5)
        {
            var listRequest = _customSearchAPIService.Cse.List();
            listRequest.Q = query;
            listRequest.Cx = Environment.GetEnvironmentVariable("GOOGLE_CSE_ID");

            var search = await listRequest.ExecuteAsync();
            var items = search.Items.ToArray();

            var documents = await Task.WhenAll(items.Select(async (item) =>
            {
                var embedding = await GetEmbedding(embeddingClient, $"Title: {item.Title}\nSnippet: {item.Snippet}");
                return new Document
                {
                    Snippet = item.Snippet,
                    Link = item.Link,
                    Title = item.Title,
                    Embedding = embedding
                };
            }));

            var queryEmbedding = await embeddingClient.GenerateEmbeddingAsync(query);
            var queryVector = queryEmbedding.Value.ToFloats().ToArray();

            foreach (var doc in documents)
            {
                doc.Similarity = CosineSimilarity(queryVector, doc.Embedding);
            }

            var topDocs = documents.OrderByDescending(doc => doc.Similarity).Take(topK).ToArray();

            var scrapeTasks = topDocs.Select(doc => ScrapeText(doc.Link));
            var scrapedTexts = await Task.WhenAll(scrapeTasks);

            for (int i = 0; i < topDocs.Length; i++)
            {
                topDocs[i].Text = scrapedTexts[i];
            }

            return topDocs;
        }

        private static float CosineSimilarity(float[] vectorA, float[] vectorB)
        {
            float dotProduct = 0;
            float magnitudeA = 0;
            float magnitudeB = 0;

            for (int i = 0; i < vectorA.Length; i++)
            {
                dotProduct += vectorA[i] * vectorB[i];
                magnitudeA += vectorA[i] * vectorA[i];
                magnitudeB += vectorB[i] * vectorB[i];
            }

            magnitudeA = MathF.Sqrt(magnitudeA);
            magnitudeB = MathF.Sqrt(magnitudeB);

            if (magnitudeA == 0 || magnitudeB == 0)
                return 0;

            return dotProduct / (magnitudeA * magnitudeB);
        }
    }
}
