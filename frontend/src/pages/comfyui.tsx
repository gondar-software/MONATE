import { comfyuiDataTypes, comfyuiModelTypes } from "@app/constants";
import { Accordion, ComfyUINavbarCard, ComfyUIWorkCard } from "@app/controls";
import { useSaveVideoBackgroundMode } from "@app/global";
import { handleNetworkError } from "@app/handlers";
import { useRedirectionHelper } from "@app/helpers";
import { useFormCryptionMiddleware, useJsonCryptionMiddleware } from "@app/middlewares";
import { useAlert, useHeader, useLoading } from "@app/providers";
import { ComfyUIInputData, ComfyUIWorkData, GenAIModelType } from "@app/types";
import { Bars3Icon, TrashIcon, XMarkIcon } from "@heroicons/react/24/solid";
import { useEffect, useState } from "react";

export const ComfyUI = () => {
    const { jsonClient } = useJsonCryptionMiddleware();
    const { formClient } = useFormCryptionMiddleware();
    const { showLoading, hideLoading } = useLoading();
    const { showAuthInfo } = useHeader();
    const { addAlert } = useAlert();
    const saveVideoBackgroundMode = useSaveVideoBackgroundMode();
    const redirect = useRedirectionHelper();
    const [model, setModel] = useState<GenAIModelType>('mimicmotion');
    const [works, setWorks] = useState<ComfyUIWorkData[]>([]);
    const [processing, setProcessing] = useState<boolean>(false);
    const [progress, setProgress] = useState<string>('');
    const [showNavBar, setShowNavBar] = useState<boolean>(() => window.innerWidth >= 1120);
    
    const fetchWorks = async () => {
        showLoading();
        setWorks([]);
        await jsonClient.get(`/comfyui?type=${comfyuiModelTypes[model as keyof typeof comfyuiModelTypes]}`)
            .then(res => {
                setWorks(res.data);
            }).catch(err => {
                handleNetworkError(err, addAlert)
                if (err.response.status === 401)
                    redirect('/auth/login');
                else if (err.response.status === 504 || err.response.status === 505)
                    redirect('/');
            }
            ).finally(() => {
                saveVideoBackgroundMode(1);
                showAuthInfo();
                hideLoading();
            });
    };

    useEffect(() => {
        fetchWorks();
    }, [model]);

    const handleSubmit = async (inputData: any) => {
        try
        {
            setProcessing(true);
            setProgress('Uploading');

            setWorks([...works, {
                progress: true
            }]);
            
            const uploadPromises = Object.entries(inputData).map(async ([_, value]) => {
                if ((value as ComfyUIInputData).type === 'image' || (value as ComfyUIInputData).type === 'video') {
                    const formData = new FormData();
                    formData.append((value as ComfyUIInputData).type, (value as ComfyUIInputData).value);
                    const response = await formClient.post(`/upload/${(value as ComfyUIInputData).type}`, formData);
                    return {
                        name: (value as ComfyUIInputData).name,
                        type: comfyuiDataTypes[(value as ComfyUIInputData).type as keyof typeof comfyuiDataTypes],
                        value: response.data.filePath
                    }
                }
                else return {
                    name: (value as ComfyUIInputData).name,
                    type: comfyuiDataTypes[(value as ComfyUIInputData).type as keyof typeof comfyuiDataTypes],
                    value: (value as ComfyUIInputData).value
                }
            });
            const updatedData = await Promise.all(uploadPromises);
            
            const prompt = {
                type: comfyuiModelTypes[model as keyof typeof comfyuiModelTypes],
                inputs: updatedData,
            }

            const res = await jsonClient.post('/comfyui/prompt',
                prompt
            );

            connectWebsocket(res.data.clientId, res.data.promptId);
        }
        catch (error) {
            setProcessing(false);
            setWorks(works.filter((work: ComfyUIWorkData) => work.progress !== true));
        }
    };

    const downloadOutput = (clientId: string, promptId: string) => {
        jsonClient.get(
            `/comfyui/output?clientId=${clientId}&promptId=${promptId}`
        ).then(res => {
            setWorks((prev) => [
                ...prev.slice(0, -1),
                res.data,
            ]);
        }).catch(err => {
            handleNetworkError(err, addAlert)
            if (err.response.status === 401)
                redirect('/auth/login');
            else if (err.response.status === 504 || err.response.status === 505)
                redirect('/');
        }).finally(() => {
            setProcessing(false);
        });
    }

    const connectWebsocket = (clientID: string, promptId: string) => {
        const ws = new WebSocket(`/ws/comfyui`);
        let processing = true;

        ws.onopen = () => {
            sendMessage(clientID);
        };

        ws.onmessage = (event) => {
            const msg = event.data;
            const msgData = JSON.parse(msg);

            msgData.map((m: any) => {
                if (m.Type === 0)
                {
                    setProgress(`Progress: ${m.Message}`)
                }
                else if (m.Type === 1) {
                    setProgress(`Downloading`)
                    disconnect();
                    downloadOutput(clientID, promptId);
                }
                else if (m.Type === 2) {
                    setProgress('');
                    setProcessing(false);
                    disconnect();
                }
            })

            if (processing)
            {
                sendMessage(clientID);
            }
        }

        ws.onclose = () => {
            processing = false;
        };

        ws.onerror = (error) => {
            processing = false;
            console.error('WebSocket error', error);
            disconnect();
        };

        const disconnect = () => {
            if (ws.readyState === WebSocket.OPEN) 
                ws.close();
        };

        const sendMessage = (message: string) => {
            if (ws.readyState === WebSocket.OPEN)
                ws.send(message);
        }
    }

    const handleDeleteWork = (id: number) => {
        jsonClient.post('/comfyui/delete',
            id
        ).then((_) => {
            setWorks(works.filter((work, _) => work.id !== id));
        }).catch((err) => {
            handleNetworkError(err, addAlert)
            if (err.response.status === 401)
                redirect('/auth/login');
            else if (err.response.status === 504 || err.response.status === 505)
                redirect('/');
        }).finally(() => {
        });
    };
    
    useEffect(() => {
        const handleResize = () => {
            setShowNavBar(window.innerWidth >= 1128);
        };
    
        window.addEventListener("resize", handleResize);
        
        handleResize();
    
        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    return (
        <div className="h-screen w-full py-16 px-2">
            <div className="w-full h-full flex rounded-lg bg-white dark:bg-gray-800">
                <div className={`${showNavBar ? 'visible' : 'hidden'} w-80`}>
                    <ComfyUINavbarCard model={model} processing={processing} setModel={setModel} onSubmit={handleSubmit} />
                </div>
                <div className="relative w-full h-full flex flex-col items-center">
                    <div className="w-full">
                        <button type="button" onClick={() => setShowNavBar(!showNavBar)} className={`w-12 h-12 m-2 bg-gray-300 dark:bg-gray-700 p-2 rounded-lg flex justify-center items-center hover:text-gray-900 dark:hover:text-white text-gray-500 dark:text-gray-500 active:text-gray-900 dark:active:text-white`}>
                            {showNavBar ? <XMarkIcon className="w-10 h-10" /> : <Bars3Icon className="w-10 h-10" />}
                        </button>
                    </div>
                    <Accordion
                        className={`w-full max-w-3xl px-2 mb-2 h-full overflow-y-auto ${!(window.innerWidth >= 1120 || !showNavBar) && 'hidden'}`}
                        items={works.map((work: any) => {
                            return {
                                header: 
                                    <TrashIcon 
                                        className="ml-4 h-6 w-6 text-gray-400 dark:text-gray-400 hover:text-red-500 hover:dark:text-red-500 cursor-pointer"
                                        onClick={() => {
                                            if (work.id)
                                                handleDeleteWork(work.id);
                                            else
                                            {
                                                setProcessing(false);
                                                setProgress('');
                                            }
                                        }}
                                    />,
                                body: 
                                    <ComfyUIWorkCard 
                                        work={work}
                                        progress={progress}
                                    />
                            }
                        })}
                    />
                </div>
            </div>
        </div>
    )
};

export default ComfyUI;
