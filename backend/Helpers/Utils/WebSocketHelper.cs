namespace Helpers.Utils
{
    using System.Net.WebSockets;
    using System.Text;
    using Temp;

    public class WebSocketHelper
    {
        public static async Task HandleChatbotWebSocketAsync(WebSocket webSocket)
        {
            var buffer = new byte[5120];
            WebSocketReceiveResult result;

            try
            {
                while (webSocket.State == WebSocketState.Open)
                {
                    result = await webSocket.ReceiveAsync(new ArraySegment<byte>(buffer), CancellationToken.None);

                    if (result.MessageType == WebSocketMessageType.Text)
                    {
                        var Id = Encoding.UTF8.GetString(buffer, 0, result.Count);
                        string msg = ChatbotTemp.GetMessages(Id);
                        var responseBuffer = Encoding.UTF8.GetBytes(msg);
                        await webSocket.SendAsync(new ArraySegment<byte>(responseBuffer), WebSocketMessageType.Text, true, CancellationToken.None);
                        Thread.Sleep(100);
                    }
                    else if (result.MessageType == WebSocketMessageType.Close)
                    {
                        await webSocket.CloseAsync(WebSocketCloseStatus.NormalClosure, "Closing connection", CancellationToken.None);
                    }
                }
            }
            catch
            {
            }
        }

        public static async Task HandleComfyUIWebSocketAsync(WebSocket webSocket)
        {
            var buffer = new byte[5120];
            WebSocketReceiveResult result;

            try
            {
                while (webSocket.State == WebSocketState.Open)
                {
                    result = await webSocket.ReceiveAsync(new ArraySegment<byte>(buffer), CancellationToken.None);

                    if (result.MessageType == WebSocketMessageType.Text)
                    {
                        var Id = Encoding.UTF8.GetString(buffer, 0, result.Count);
                        string msg = ComfyUITemp.GetMessages(Id);
                        var responseBuffer = Encoding.UTF8.GetBytes(msg);
                        await webSocket.SendAsync(new ArraySegment<byte>(responseBuffer), WebSocketMessageType.Text, true, CancellationToken.None);
                        Thread.Sleep(100);
                    }
                    else if (result.MessageType == WebSocketMessageType.Close)
                    {
                        await webSocket.CloseAsync(WebSocketCloseStatus.NormalClosure, "Closing connection", CancellationToken.None);
                    }
                }
            }
            catch
            {
            }
        }
    }
}