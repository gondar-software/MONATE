using Enums;
using Helpers.Utils;
using Newtonsoft.Json.Linq;
using Packets.ComfyUI;

namespace Helpers.ComfyUI
{
    public class VTONHelper
    {
        private static readonly Dictionary<string, ComfyUIData[]> _inputDicts = new Dictionary<string, ComfyUIData[]>();

        public static async Task<string> Prompt(string id, params ComfyUIData[] inputs)
        {
            var workflow = JObject.Parse(File.ReadAllText("Helpers/ComfyUI/Workflows/vton-api.json"));

            foreach (var input in inputs)
            {
                switch (input.Type)
                {
#pragma warning disable
                    case ComfyUIDataTypes.Text:
                        {
                            ((JObject)((JObject)workflow["17"])["inputs"])["string"] = input.Value;
                            break;
                        }
                    case ComfyUIDataTypes.Image:
                        {
                            if (input.Name.ToLower().Contains("source"))
                            {
                                var file = await FirebaseHelper.DownloadFile(input.Value);
                                var path = input.Value.Substring(input.Value.IndexOf("/") + 1);
                                ((JObject)((JObject)workflow["3"])["inputs"])["image"] = path;
                                await ApiHelper.UploadImage(file, path);
                            }
                            else if (input.Name.ToLower().Contains("target"))
                            {
                                var file = await FirebaseHelper.DownloadFile(input.Value);
                                var path = input.Value.Substring(input.Value.IndexOf("/") + 1);
                                ((JObject)((JObject)workflow["4"])["inputs"])["image"] = path;
                                await ApiHelper.UploadImage(file, path);
                            }
                            break;
                        }
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
                var outputName = await FirebaseHelper.SaveFileAndGetPath(outputFile, FileType.Image) ?? "";
                var outputData = new ComfyUIOutput
                {
                    Type = ComfyUIModelTypes.VTON,
                    Inputs = inputs.ToList(),
                    Output = new ComfyUIData
                    {
                        Type = ComfyUIDataTypes.Image,
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
