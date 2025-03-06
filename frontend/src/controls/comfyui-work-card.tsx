import { LoadingSpin } from "@app/components";
import { comfyuiDataTypes } from "@app/constants";
import { useJsonNoTokenOnlyRequestCryptionMiddleware } from "@app/middlewares";
import { useEffect, useState } from "react";

export const ComfyUIWorkCard = (props: any) => {
    const [loading, setLoading] = useState(true);
    const [progress, setProgress] = useState(true);
    const [output, setOutput] = useState<any>({});
    const [inputs, setInputs] = useState<any[]>([]);

    const { jsonNoTokenOnlyRequestClient } = useJsonNoTokenOnlyRequestCryptionMiddleware();

    const fetchWork = async(work: any) => {
        const comfyuiDataMap = Object.entries(comfyuiDataTypes).reduce((acc: any, [key, value]) => {
            acc[value] = key;
            return acc;
        }, {});

        const type = comfyuiDataMap[work.output.type as keyof typeof comfyuiDataMap];
        await jsonNoTokenOnlyRequestClient.get(
            `/download/${type}?filePath=${work.output.value}`,
            {
                responseType: 'blob'
            }
        ).then(res => {
            const url = URL.createObjectURL(res.data);
            setOutput({
                type: type,
                value: url,
            });
        }).catch(_ => {}).finally(() => {
        });

        setInputs(await Promise.all(work.inputs.map(async(input: any) => {
            try
            {
                const inputType = comfyuiDataMap[input.type as keyof typeof comfyuiDataMap];
                const res = await jsonNoTokenOnlyRequestClient.get(
                    `/download/${inputType}?filePath=${input.value}`,
                    {
                        responseType: 'blob'
                    }
                );
                return {
                    name: input.name,
                    type: inputType,
                    value: URL.createObjectURL(res.data),
                }
            }
            catch
            {
                return {
                    name: input.name,
                    type: 'none',
                    value: '',
                }
            }
        })));

        setLoading(false);
    }

    useEffect(() => {
        if (props.work.progress)
            setProgress(true);
        else {
            setProgress(false);
            fetchWork(props.work);
        }
    }, [props.work]);

    return (
        <div className="w-full p-4 flex-1">
            {loading ? 
                <div className="w-full h-32 flex justify-center items-center">
                    <LoadingSpin className='w-12 h-12' />
                    {progress && 
                        <div className="text-gray-900 dark:text-white">
                            &nbsp;{props.progress}
                        </div>} 
                </div> :
                <div className="w-full flex md:flex-row flex-col">
                    <div className="md:w-3/4 w-full px-1">
                        <div className="text-gray-900 dark:text-white text-xl mb-4">Output:</div>
                        {output.type === 'image' && <img className="w-full rounded-md" src={output.value} />}
                        {output.type === 'video' && <video className="w-full rounded-md" controls src={output.value} />}
                    </div>
                    <div className="md:w-1/4 md:mt-0 mt-8 w-full px-1 flex flex-col h-full overflow-y-auto">
                        <div className="text-gray-900 dark:text-white text-xl mb-4">Inputs:</div>
                        {inputs.map((input, index) => (
                            <div
                                key={index}
                            >
                                {input.type === 'image' && 
                                    <div className="flex flex-col mb-3">
                                        <div className="text-gray-900 dark:text-white">{input.name}</div>
                                        <img className="rounded-md w-full mt-2" src={input.value} />
                                    </div>}
                                {input.type === 'video' && 
                                    <div className="flex flex-col mb-3">
                                        <div className="text-gray-900 dark:text-white">{input.name}</div>
                                        <video className="rounded-md w-full mt-2" controls src={input.value} />
                                    </div>}
                            </div>
                        ))}
                    </div>
                </div>
            }
        </div>
    )
}

export default ComfyUIWorkCard;