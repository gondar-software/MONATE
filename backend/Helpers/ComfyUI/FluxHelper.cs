using Enums;
using Helpers.Utils;
using Newtonsoft.Json.Linq;
using Packets.ComfyUI;

namespace Helpers.ComfyUI
{
    public class FluxHelper
    {
        private static readonly Dictionary<string, ComfyUIData[]> _inputDicts = new Dictionary<string, ComfyUIData[]>();

        public static async Task<string> Prompt(string id, params ComfyUIData[] inputs)
        {
            var workflow = JObject.Parse(File.ReadAllText("Helpers/ComfyUI/Workflows/flux-api.json"));

            foreach (var input in inputs)
            {
                switch (input.Type)
                {
#pragma warning disable
                    case ComfyUIDataTypes.Text:
                        {
                            ((JObject)((JObject)workflow["54"])["inputs"])["text"] = input.Value;
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
                    Type = ComfyUIModelTypes.Flux,
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
