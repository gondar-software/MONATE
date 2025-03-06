import { FormSelect1, FormSubmitButton1, ImageUploader, VideoUploader } from "@app/components";
import { comfyuiModels } from "@app/constants";
import { useAlert } from "@app/providers";
import { useEffect, useState } from "react";

export const ComfyUINavbarCard = (props: any) => {
    const [inputData, setInputData] = useState({});
    const { addAlert } = useAlert();

    const validateInputs = () => {
        const selectedModel = comfyuiModels.find(model => model.model === props.model);
        if (!selectedModel) return false;

        selectedModel.inputs.forEach(input => {
            const inputValue = inputData[input.key as keyof typeof inputData];
            if (!inputValue)
                return false;
        });

        return true;
    };

    useEffect(() => {
        setInputData({});
    }, [props.model]);

    const handleSubmit = (e: any) => {
        e.preventDefault();
        if (validateInputs()) {
            props.onSubmit(inputData);
        }
        else {
            addAlert({
                mode: 'danger',
                title: 'Error',
                message: 'Please fill all the inputs',
            })
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col w-80 h-full bg-white border border-gray-200 rounded-lg shadow p-8 dark:bg-gray-800 dark:border-gray-700">
            <FormSelect1
                value={props.model}
                onChange={(e: any) => props.setModel(e.target.value)}
                options={
                    comfyuiModels.map((model) => ({
                        value: model.model,
                        label: model.name,
                    }))}
            />
            <div className="w-full mt-6 h-1 px-3 mb-3 bg-gray-400" />
            <div className="w-full h-full overflow-y-auto px-2 overflow-x-hidden pb-2">
                {comfyuiModels.filter(model => model.model === props.model)[0].inputs.map((input, index) => (
                    <div key={index} className="flex flex-col items-start w-full mb-2">
                        {input.type === "text" && (
                            <>
                                <div className="text-sm font-medium text-gray-900 dark:text-white">
                                    {input.name}
                                </div>
                                <textarea
                                    name={input.type}
                                    id={input.type}
                                    disabled={props.processing}
                                    onChange={(e) => {
                                        setInputData({
                                            ...inputData,
                                            [input.key]: {
                                                name: input.name,
                                                type: input.type,
                                                value: e.target.value,
                                            }
                                        })
                                    }}
                                    placeholder={`Type your ${input.name} here...`}
                                    className="w-full p-2 text-sm h-auto overflow-y-hidden bg-gray-50 border border-gray-300 rounded-lg resize-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                                    rows={3}
                                />
                            </>
                        )}
                        {input.type === "image" && (
                            <>
                                <div className="text-sm font-medium text-gray-900 dark:text-white">
                                    {input.name}
                                </div>
                                <ImageUploader
                                    id={index}
                                    className="w-full"
                                    disabled={props.processing}
                                    maxWidth={4000}
                                    maxHeight={4000}
                                    onImageUpload={(file: File) => {
                                        setInputData({
                                            ...inputData,
                                            [input.key]: {
                                                name: input.name,
                                                type: input.type,
                                                value: file,
                                            }
                                        })
                                    }}
                                />
                            </>
                        )}
                        {input.type === "video" && (
                            <>
                                <div className="text-sm font-medium text-gray-900 dark:text-white">
                                    {input.name}
                                </div>
                                <VideoUploader
                                    id={index}
                                    className="w-full"
                                    disabled={props.processing}
                                    onVideoUpload={(file: File) => {
                                        setInputData({
                                            ...inputData,
                                            [input.key]: {
                                                name: input.name,
                                                type: input.type,
                                                value: file,
                                            }
                                        })
                                    }}
                                />
                            </>
                        )}
                    </div>
                ))}
                <div className="h-4" />
                <FormSubmitButton1
                    submitting={props.processing}
                >
                    Prompt
                </FormSubmitButton1>
            </div>
        </form>
    );
};

export default ComfyUINavbarCard;
