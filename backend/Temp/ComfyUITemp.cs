using Enums;
using Models;
using Newtonsoft.Json;

namespace Temp
{
    public static class ComfyUITemp
    {
        private static readonly Dictionary<string, Queue<ComfyUIMessage>> _temp;
        private static readonly object _lock = new object();

        static ComfyUITemp()
        {
            _temp = new Dictionary<string, Queue<ComfyUIMessage>>();
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
            var msg = new List<ComfyUIMessage>();
            lock (_lock)
            {
                if (_temp.ContainsKey(id))
                    while (_temp[id].Count > 0)
                    {
                        var chunk = _temp[id].Dequeue();
                        msg.Add(chunk);
                    }
                else
                {
                    msg.Add(new ComfyUIMessage
                    {
                        Type = ComfyUIMessageType.Error,
                        Message = "Can't find session id."
                    });
                }
            }

            return JsonConvert.SerializeObject(msg);
        }

        public static void SetMessage(string id, ComfyUIMessage message)
        {
            lock (_lock)
            {
                if (!_temp.ContainsKey(id))
                    _temp.Add(id, new Queue<ComfyUIMessage>());
                _temp[id].Enqueue(message);
            }
        }
    }
}
