import { comfyuiModelTypes } from "@app/constants";
import { ComfyUINavbarCard } from "@app/controls";
import { useSaveVideoBackgroundMode } from "@app/global";
import { handleNetworkError } from "@app/handlers";
import { useRedirectionHelper } from "@app/helpers";
import { useFormCryptionMiddleware, useJsonCryptionMiddleware } from "@app/middlewares";
import { useAlert, useHeader, useLoading } from "@app/providers";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/solid";
import { useEffect, useState } from "react";

export const ComfyUI = () => {
    const { jsonClient } = useJsonCryptionMiddleware();
    const { formClient } = useFormCryptionMiddleware();
    const { showLoading, hideLoading } = useLoading();
    const { showAuthInfo } = useHeader();
    const { addAlert } = useAlert();
    const saveVideoBackgroundMode = useSaveVideoBackgroundMode();
    const redirect = useRedirectionHelper();
    const [model, setModel] = useState('mimicmotion');
    const [works, setWorks] = useState<any[]>([]);
    const [processing, setProcessing] = useState(false);
    const [showNavBar, setShowNavBar] = useState(() => window.innerWidth >= 1120);
    
    const fetchWorks = async () => {
        showLoading();
        await jsonClient.get(`/comfyui?type=${comfyuiModelTypes[model as keyof typeof comfyuiModelTypes]}`)
            .then(res => {
                setWorks(res.data);
            }).catch(err => {
                handleNetworkError(err, addAlert)
                if (err.response.status === 401)
                    redirect('/auth/login');
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

    const handleSubmit = (inputData: any) => {
        setProcessing(true);
        console.log(inputData);

        Object.entries(inputData).forEach(([_, value]) => {
            if ((value as any).type === 'image' || (value as any).type === 'video') {
                const formDt = new FormData();
                formDt.append((value as any).type, (value as any).value);
                const response = formClient.post(
                    `/upload/${(value as any).type}`, 
                    formDt
                );
            }
        });
    }

    const connectWebsocket = (id: string) => {
        const ws = new WebSocket(`/ws/comfyui`);
        let processing = true;

        ws.onopen = () => {
            sendMessage(id);
        };

        ws.onmessage = (event) => {
            const msg = event.data;
            const msgData = JSON.parse(msg);

            msgData.map((m: any) => {
                if (m.Type === 0)
                {                 
                }
                else if (m.Type === 2) {
                    setProcessing(false);
                    disconnect();
                }
                else if (m.Type === 1) {
                    addAlert('danger', m.Message);
                    setProcessing(false);
                    disconnect();
                }
                else if (m.Type === 3) {
                    const ragDoc = JSON.parse(m.Message);
                }
            })

            if (processing)
            {
                sendMessage(id);
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
                </div>
            </div>
        </div>
    )
};

export default ComfyUI;
