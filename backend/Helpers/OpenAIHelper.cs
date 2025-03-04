using OpenAI;
using OpenAI.Chat;
using OpenAI.Embeddings;
using System.Collections.Concurrent;
using System.Text;
using static Helpers.RAGHelper;

namespace Helpers
{
    public static class OpenAIHelper
    {
        private static readonly ConcurrentDictionary<string, List<List<string>>> _histories = new();
        private static readonly ConcurrentDictionary<string, Document[]> _documents = new();
        private static readonly OpenAIClient _client;
        private static readonly EmbeddingClient _embeddingClient;
        private static readonly ChatClient _chatClient;

        static OpenAIHelper()
        {
            _client = new OpenAIClient(Environment.GetEnvironmentVariable("OPENAI_API_KEY"));
            _embeddingClient = _client.GetEmbeddingClient("text-embedding-ada-002");
            _chatClient = _client.GetChatClient("gpt-4o");
        }

        public static async IAsyncEnumerable<string> Prompt(string id, string query, bool? rag, List<List<string>>? history)
        {
            var messageList = new List<ChatMessage>();
            if (history != null && history.Count != 0)
                _histories.AddOrUpdate(id, _ => history, (_, _) => history);

            if (_histories.TryGetValue(id, out var historyList))
            {
                foreach (var item in historyList)
                {
                    messageList.Add(new UserChatMessage(item[0]));
                    messageList.Add(new AssistantChatMessage(item[1]));
                }
            }

            if (rag == true)
            {
                var ragDocs = await GetRagDocs(_embeddingClient, query);
                foreach (var doc in ragDocs)
                {
                    messageList.Add(new SystemChatMessage($"Title: {doc.Title}\nSnippet: {doc.Snippet}\nText: {doc.Text}"));
                }
                _documents.AddOrUpdate(id, _ => ragDocs, (_, _) => ragDocs);
            }

            messageList.Add(new UserChatMessage(query));

            var response = _chatClient.CompleteChatStreamingAsync(messageList.ToArray());
            var assistantMessage = new StringBuilder();

            await foreach (var message in response)
            {
                var msg = string.Concat(message.ContentUpdate.Select(part => part.Text));
                yield return msg;
                assistantMessage.Append(msg);
            }

            _histories.AddOrUpdate(id,
                _ => new List<List<string>> ([[query, assistantMessage.ToString()]]),
                (_, historyList) => { historyList.Add([query, assistantMessage.ToString()]); return historyList; });
        }

        public static Document[] GetRagDocuments(string id)
        {
            if (_documents.TryGetValue(id, out var documents))
            {
                return documents;
            }
            else
            {
                return [];
            }    
        }

        public static void DeleteHistory(string id)
        {
            _histories.TryRemove(id, out _);
            _documents.TryRemove(id, out _);
        }
    }
}
