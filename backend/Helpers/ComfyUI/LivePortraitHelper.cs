using Enums;
using Helpers.Utils;
using Newtonsoft.Json.Linq;
using Packets.ComfyUI;

namespace Helpers.ComfyUI
{
    public class LivePortraitHelper
    {
        private static readonly Dictionary<string, ComfyUIData[]> _inputDicts = new Dictionary<string, ComfyUIData[]>();

        public static async Task<string> Prompt(string id, params ComfyUIData[] inputs)
        {
            var workflow = JObject.Parse(File.ReadAllText("Helpers/ComfyUI/Workflows/liveportrait-api.json"));

            foreach (var input in inputs)
            {
                switch (input.Type)
                {
#pragma warning disable
                    case ComfyUIDataTypes.Image:
                        {
                            var file = await FirebaseHelper.DownloadFile(input.Value);
                            var path = input.Value.Substring(input.Value.IndexOf("/") + 1);
                            ((JObject)((JObject)workflow["196"])["inputs"])["image"] = path;
                            await ApiHelper.UploadImage(file, path);
                            break;
                        }
                    case ComfyUIDataTypes.Video:
                        {
                            var file = await FirebaseHelper.DownloadFile(input.Value);
                            var path = input.Value.Substring(input.Value.IndexOf("/") + 1);
                            ((JObject)((JObject)workflow["8"])["inputs"])["video"] = path;
                            await ApiHelper.UploadImage(file, path);
                            break;
                        }
                    default:
                        break;
#pragma warning restore
                }
            }

            var promptId = (string?)(await ApiHelper.QueuePrompt(workflow, id))?["prompt_id"] ?? "";
            _inputDicts.TryAdd(promptId, inputs);

            ApiHelper.TrackProgress(workflow, promptId, id);

            return promptId;
        }

        public static async Task<ComfyUIOutput?> GetOutput(string clientId, string promptId)
        {
            if (_inputDicts.TryGetValue(promptId, out var inputs))
            {
                var outputFile = await ApiHelper.DownloadData(clientId, promptId);
                var outputName = await FirebaseHelper.SaveFileAndGetPath(outputFile, FileType.Video) ?? "";
                var outputData = new ComfyUIOutput
                {
                    Type = ComfyUIModelTypes.LivePortrait,
                    Inputs = inputs.ToList(),
                    Output = new ComfyUIData
                    {
                        Type = ComfyUIDataTypes.Video,
                        Value = outputName
                    }
                };

                return outputData;
            }
            else
            {
                return null;
            }
        }
    }
}
