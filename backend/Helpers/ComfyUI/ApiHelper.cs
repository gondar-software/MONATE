namespace Helpers.ComfyUI
{
    using Enums;
    using Models;
    using Newtonsoft.Json;
    using Newtonsoft.Json.Linq;
    using System.Net.Http;
    using System.Text;
    using System.Web;
    using Temp;
    using WebSocketSharp;

    public static class ApiHelper
    {
        private static readonly HttpClient client = new HttpClient();
        private static string serverUrl = Environment.GetEnvironmentVariable("COMFYUI_SERVER_URL") ?? "";
        private static string wsUrl = Environment.GetEnvironmentVariable("COMFYUI_WS_URL") ?? "";

        public static void Refresh()
        {
            serverUrl = Environment.GetEnvironmentVariable("COMFYUI_SERVER_URL") ?? "";
            wsUrl = Environment.GetEnvironmentVariable("COMFYUI_WS_URL") ?? "";
        }

        public static async Task<JObject?> QueuePrompt(JObject prompt, string clientId)
        {
            using (var client = new HttpClient())
            {
                var data = new
                {
                    prompt = prompt,
                    client_id = clientId
                };

                string jsonData = JsonConvert.SerializeObject(data);
                var content = new StringContent(jsonData, Encoding.UTF8, "application/json");

                HttpResponseMessage response = await client.PostAsync($"{serverUrl}/prompt", content);
                response.EnsureSuccessStatusCode();

                string responseBody = await response.Content.ReadAsStringAsync();
                return JsonConvert.DeserializeObject<JObject>(responseBody);
            }
        }

        public static async Task<string> UploadImage(byte[] imageFile, string name, string imageType = "input", bool overwrite = true)
        {
            using (var client = new HttpClient())
            {
                using (var form = new MultipartFormDataContent())
                {
                    var fileContent = new ByteArrayContent(imageFile);

                    form.Add(fileContent, "image", name);
                    form.Add(new StringContent(imageType), "type");
                    form.Add(new StringContent(overwrite.ToString().ToLower()), "overwrite");

                    HttpResponseMessage response = await client.PostAsync($"{serverUrl}/upload/image", form);
                    response.EnsureSuccessStatusCode();

                    return await response.Content.ReadAsStringAsync();
                }
            }
        }

        public static async Task<string> InterruptPromptAsync()
        {
            var url = $"{serverUrl}/interrupt";
            var response = await client.PostAsync(url, new StringContent(""));
            return await response.Content.ReadAsStringAsync();
        }

        public static async Task<IFormFile> GetDataAsync(string filename, string subfolder, string folderType)
        {
            var data = new Dictionary<string, string>
            {
                { "filename", filename },
                { "subfolder", subfolder },
                { "type", folderType }
            };

            var queryString = HttpUtility.ParseQueryString(string.Empty);
            foreach (var pair in data)
            {
                queryString[pair.Key] = pair.Value;
            }

            var url = $"{serverUrl}/view?{queryString.ToString()}";
            var response = await client.GetAsync(url);

            if (response.IsSuccessStatusCode)
            {
                var buffer = await response.Content.ReadAsByteArrayAsync();
                var contentType = response.Content.Headers.ContentType?.ToString() ?? "application/octet-stream";

                return new FormFile(new MemoryStream(buffer), 0, buffer.Length, "file", filename)
                {
                    Headers = new HeaderDictionary(),
                    ContentType = contentType
                };
            }
            else
            {
                throw new Exception($"Failed to get data: {response.StatusCode}");
            }
        }

        public static async Task<dynamic?> GetHistoryAsync(string promptId)
        {
            var url = $"{serverUrl}/history/{promptId}";
            var response = await client.GetAsync(url);
            var responseContent = await response.Content.ReadAsStringAsync();
            return JsonConvert.DeserializeObject<dynamic>(responseContent);
        }

        public static async Task<IFormFile?> DownloadData(string clientId, string promptId, bool allowPreview = true)
        {
            var history = await GetHistoryAsync(promptId);

            if (history?.ContainsKey(promptId) == true)
            {
                var nodeOutputs = history[promptId]["outputs"];

                foreach (var nodeId in nodeOutputs)
                {
                    var nodeOutput = nodeId.Value;
                    foreach (var outputs in nodeOutput)
                    {
                        if (outputs.Name == "images" || outputs.Name == "gifs")
                        {
                            foreach (var output in outputs.Value)
                            {
                                if (allowPreview && output["type"].ToString() == "temp")
                                {
                                    return await GetDataAsync(output["filename"].ToString(), output["subfolder"].ToString(), output["type"].ToString());
                                }
                                if (output["type"].ToString() == "output")
                                {
                                    return await GetDataAsync(output["filename"].ToString(), output["subfolder"].ToString(), output["type"].ToString());
                                }
                            }
                        }
                    }
                }
            }

            return null;
        }

        public static async Task<dynamic?> GetNodeInfoByClassAsync(string nodeClass)
        {
            var url = $"{serverUrl}/object_info/{nodeClass}";
            var response = await client.GetAsync(url);
            var responseContent = await response.Content.ReadAsStringAsync();
            return JsonConvert.DeserializeObject<dynamic>(responseContent);
        }

        public static async Task<string> ClearComfyCacheAsync(bool unloadModels = false, bool freeMemory = false)
        {
            var clearData = new
            {
                unload_models = unloadModels,
                free_memory = freeMemory
            };

            var json = JsonConvert.SerializeObject(clearData);
            var content = new StringContent(json, Encoding.UTF8, "application/json");

            var url = $"{serverUrl}/free";
            var response = await client.PostAsync(url, content);
            return await response.Content.ReadAsStringAsync();
        }

        public static void TrackProgress(JObject prompt, string promptId, string clientId)
        {
            var nodeIds = new List<string>(prompt.Properties().Select(p => p.Name));
            var finishedNodes = new HashSet<string>();

            var ws = new WebSocket($"{wsUrl}/ws?clientId={clientId}");

            ws.OnMessage += (sender, e) =>
            {
                try
                {
                    var message = e.Data;
                    if (!string.IsNullOrEmpty(message))
                    {
                        var jsonMessage = JObject.Parse(message);

                        if (jsonMessage.ContainsKey("type"))
                        {
                            var messageType = jsonMessage["type"]?.ToString();
                            if (messageType == "progress")
                            {
                                var data = jsonMessage["data"]?.ToObject<JObject>();
                                var currentStep = data?["value"]?.Value<int>();
                                var maxStep = data?["max"]?.Value<int>();
                                ComfyUITemp.SetMessage(clientId, new ComfyUIMessage
                                {
                                    Type = ComfyUIMessageType.Progress,
                                    Message = $"{Math.Round(100f * (finishedNodes.Count + ((float?)currentStep ?? 0) / (maxStep ?? 1)) / nodeIds.Count, 2)}%"
                                });
                            }
                            else if (messageType == "execution_cached")
                            {
                                var data = jsonMessage["data"]?.ToObject<JObject>();
                                var nodes = data?["nodes"]?.ToObject<List<string>>();

                                foreach (var itm in nodes ?? [])
                                {
                                    if (!finishedNodes.Contains(itm))
                                    {
                                        finishedNodes.Add(itm);
                                    }
                                }
                                ComfyUITemp.SetMessage(clientId, new ComfyUIMessage
                                {
                                    Type = ComfyUIMessageType.Progress,
                                    Message = $"{Math.Round(100f * finishedNodes.Count / nodeIds.Count, 2)}%"
                                });
                            }
                            else if (messageType == "executing")
                            {
                                var data = jsonMessage["data"]?.ToObject<JObject>();
                                var node = data?["node"]?.ToString();

                                if (!finishedNodes.Contains(node ?? ""))
                                {
                                    finishedNodes.Add(node ?? "");
                                    ComfyUITemp.SetMessage(clientId, new ComfyUIMessage
                                    {
                                        Type = ComfyUIMessageType.Progress,
                                        Message = $"{Math.Round(100f * finishedNodes.Count / nodeIds.Count, 2)}%"
                                    });
                                }

                                if (string.IsNullOrEmpty(node?.ToString()) && data?["prompt_id"]?.ToString() == promptId)
                                {
                                    ws.Close();
                                    ComfyUITemp.SetMessage(clientId, new ComfyUIMessage
                                    {
                                        Type = ComfyUIMessageType.End,
                                        Message = ""
                                    });
                                }
                            }
                            else if (messageType == "status")
                            {
                                var data = jsonMessage["data"]?.ToObject<JObject>();
                                var status = data?["status"]?.ToObject<JObject>();
                                var exec_info = status?["exec_info"]?.ToObject<JObject>();
                                var queue_remaining = (int?)exec_info?["queue_remaining"] ?? 0;

                                var sid = (string?)data?["sid"];

                                if (queue_remaining == 0 && sid == clientId)
                                {
                                    ws.Close();
                                    ComfyUITemp.SetMessage(clientId, new ComfyUIMessage
                                    {
                                        Type = ComfyUIMessageType.End,
                                        Message = ""
                                    });
                                }
                            }
                        }
                    }
                }
                catch
                {
                    ws.Close();
                    ComfyUITemp.SetMessage(clientId, new ComfyUIMessage
                    {
                        Type = ComfyUIMessageType.Error,
                        Message = "Unknown error occurred"
                    });
                }
            };

            ws.OnClose += (sender, e) =>
            {
            };

            ws.OnError += (sender, e) =>
            {
                Console.WriteLine($"WebSocket error: {e.Message}");
            };

            ws.Connect();
        }
    }
}