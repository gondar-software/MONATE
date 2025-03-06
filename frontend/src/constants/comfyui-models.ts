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
                name: "Positive Prompt",
                key: "positive_prompt",
            },
            {
                type: "text",
                name: "Negative Prompt",
                key: "negative_prompt",
            },
        ],
        output: "image"
    },
    {
        model: "vton",
        name: "Virtual Try-on",
        inputs: [
            {
                type: "text",
                name: "Object",
                key: "object",
            },
            {
                type: "image",
                name: "Source Image",
                key: "source_image",
            },
            {
                type: "image",
                name: "Target Image",
                key: "target_image",
            }
        ],
        output: "image"
    }
]