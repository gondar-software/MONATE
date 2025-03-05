export const comfyuiModels = [
    {
        model: "mimicmotion",
        name: "Mimicmotion",
        inputs: [
            {
                type: "image",
                name: "Target Image",
                key: "target_image",
            },
            {
                type: "video",
                name: "Source Video",
                key: "source_video",
            }
        ],
        output: "video"
    },
    {
        model: "live-portrait",
        name: "Live Portrait",
        inputs: [
            {
                type: "image",
                name: "Target Image",
                key: "target_image",
            },
            {
                type: "video",
                name: "Source Video",
                key: "source_video",
            }
        ],
        output: "video"
    },
    {
        model: "flux",
        name: "Flux",
        inputs: [
            {
                type: "text",
                name: "Prompt",
                key: "prompt",
            }
        ],
        output: "image"
    },
    {
        model: "sdxl",
        name: "SDXL",
        inputs: [
            {
                type: "text",
                name: "Prompt",
                key: "prompt",
            }
        ],
        output: "image"
    }
]