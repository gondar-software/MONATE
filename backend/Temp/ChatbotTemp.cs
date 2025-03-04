using Enums;
using Models;
using Newtonsoft.Json;

namespace Temp
{
    public static class ChatbotTemp
    {
        private static readonly Dictionary<string, Queue<ChatbotMessage>> _temp;
        private static readonly object _lock = new object();

        static ChatbotTemp()
        {
            _temp = new Dictionary<string, Queue<ChatbotMessage>>();
        }

        public static void ClearMessages(string id)
        {
            lock (_lock)
            {
                _temp.Remove(id);
            }
        }

        public static string GetMessages(string id)
        {
            var msg = new List<ChatbotMessage>();
            lock (_lock)
            {
                if (_temp.ContainsKey(id))
                    while (_temp[id].Count > 0)
                    {
                        var chunk = _temp[id].Dequeue();
                        msg.Add(chunk);
                    }
            }

            return JsonConvert.SerializeObject(msg);
        }

        public static void SetMessage(string id, ChatbotMessage message)
        {
            lock (_lock)
            {
                if (!_temp.ContainsKey(id))
                    _temp.Add(id, new Queue<ChatbotMessage>());
                _temp[id].Enqueue(message);
            }
        }
    }
}
