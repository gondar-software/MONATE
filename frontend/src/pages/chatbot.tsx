import { FormTextField2 } from "@app/components";
import { ChatbotNavbarCard } from "@app/controls";
import { useSaveUnityBackgroundMode } from "@app/global";
import { handleNetworkError } from "@app/handlers";
import { useRedirectionHelper } from "@app/helpers";
import { useJsonCryptionMiddleware } from "@app/middlewares";
import { useAlert, useHeader, useLoading } from "@app/providers";
import { ArrowUpCircleIcon } from "@heroicons/react/24/solid";
import { useEffect, useState } from "react";

export const Chatbot = () => {
    const { jsonClient } = useJsonCryptionMiddleware();
    const { showLoading, hideLoading } = useLoading();
    const { showAuthInfo } = useHeader();
    const { addAlert } = useAlert();
    const saveUnityBackgroundMode = useSaveUnityBackgroundMode();
    const redirect = useRedirectionHelper();
    const [chatHistories, setChatHistories] = useState<any[]>([]);
    const [prompt, setPrompt] = useState('');
    const [processing, setProcessing] = useState(false);
    
    const fetchPortfolios = async () => {
        showLoading();
        await jsonClient.get(`/chatbot`)
            .then(res => {
                setChatHistories(res.data);
            }).catch(err => {
                handleNetworkError(err, addAlert)
                if (err.response.status === 401)
                    redirect('/auth/login');
            }
            ).finally(() => {
                saveUnityBackgroundMode('garden');
                showAuthInfo();
                hideLoading();
            });
    };

    useEffect(() => {
        //fetchPortfolios();
        saveUnityBackgroundMode('garden');
        showAuthInfo();
        hideLoading();
    }, []);

    const handleHistoryChoose = (index: number) => {
        setChatHistories((prev) =>
            prev.map((history, i) => ({
                ...history,
                selected: i === index,
            }))
        );
    }

    const handlePromptChange = (e: any) => {
        const textarea = e.target;
        setPrompt(textarea.value);

        textarea.style.height = "auto";
        textarea.style.height = `${Math.min(textarea.scrollHeight, 160)}px`;
    }

    return (
        <div className="h-screen w-full py-16 px-2">
            <div className="w-full h-full flex rounded-lg bg-white dark:bg-gray-800">
                <ChatbotNavbarCard chatbotHistories={chatHistories} onHistoryChoose={handleHistoryChoose} />
                <div className="w-full h-full flex flex-col items-center">
                    <div className='w-full max-w-3xl p-2 overflow-y-auto h-full'>

                    </div>
                    <div className="max-w-3xl w-full gap-2 flex mb-2 px-2 py-2 bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700">
                        <textarea
                            name="prompt"
                            id="prompt"
                            value={prompt}
                            disabled={processing}
                            onChange={handlePromptChange}
                            placeholder="Type your prompt here..."
                            className="w-full p-2 text-sm max-h-40 overflow-y-hidden bg-gray-50 border border-gray-300 rounded-lg resize-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                            rows={1}
                        />
                        <button
                            type="submit"
                            disabled={processing}
                            className="w-12 h-full flex justify-center items-center text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 disabled:bg-blue-700 dark:disabled:bg-blue-700"
                        >
                            {processing ? <svg aria-hidden="true" role="status" className="inline w-4 h-4 text-white animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB"/>
                                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor"/>
                            </svg> : <ArrowUpCircleIcon className="w-6 h-6" />}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
};

export default Chatbot;
