import { LoadingSpin, MarkdownPreviewer, RagDocPreviewer } from "@app/components";
import { chatbotTypes } from "@app/constants";
import { ChatbotNavbarCard } from "@app/controls";
import { useSaveVideoBackgroundMode } from "@app/global";
import { handleNetworkError } from "@app/handlers";
import { useRedirectionHelper } from "@app/helpers";
import { useJsonCryptionMiddleware } from "@app/middlewares";
import { useAlert, useHeader, useLoading } from "@app/providers";
import { ChatbotHistoryData, ChatbotMessages, ChatbotModelType } from "@app/types";
import { ArrowUpCircleIcon, Bars3Icon, GlobeAltIcon, XMarkIcon } from "@heroicons/react/24/solid";
import { useEffect, useState } from "react";

export const Chatbot = () => {
    const { jsonClient } = useJsonCryptionMiddleware();
    const { showLoading, hideLoading } = useLoading();
    const { showAuthInfo } = useHeader();
    const { addAlert } = useAlert();
    const saveVideoBackgroundMode = useSaveVideoBackgroundMode();
    const redirect = useRedirectionHelper();
    const [model, setModel] = useState<ChatbotModelType>('open-ai');
    const [chatHistories, setChatHistories] = useState<ChatbotHistoryData[]>([]);
    const [prompt, setPrompt] = useState<string>('');
    const [processing, setProcessing] = useState<boolean>(false);
    const [loadingHistory, setLoadingHistory] = useState<boolean>(false);
    const [currentHistory, setCurrentHistory] = useState<ChatbotMessages>([]);
    const [rag, setRag] = useState<boolean>(false);
    const [chatId, setChatId] = useState<string>('');
    const [showNavBar, setShowNavBar] = useState<boolean>(() => window.innerWidth >= 1120);
    
    const fetchHistories = async () => {
        showLoading();
        await jsonClient.get(`/chatbot?type=${chatbotTypes[model as keyof typeof chatbotTypes]}`)
            .then(res => {
                setChatHistories(res.data);
            }).catch(err => {
                handleNetworkError(err, addAlert)
                if (err.response.status === 401)
                    redirect('/auth/login');
                else if (err.response.status === 504 || err.response.status === 505)
                    redirect('/');
            }
            ).finally(() => {
                saveVideoBackgroundMode(1);
                setCurrentHistory([])
                showAuthInfo();
                hideLoading();
            });
    };

    useEffect(() => {
        fetchHistories();
    }, [model]);

    const connectWebsocket = (id: string) => {
        const ws = new WebSocket(`/ws/chatbot`);
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
                    setCurrentHistory((prev) => {
                        if (prev.length === 0) return prev;
                        return [
                            ...prev.slice(0, -1), 
                            [prev[prev.length - 1][0], prev[prev.length - 1][1] + m.Message]
                        ];
                    });                    
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
                    setCurrentHistory((prev) => {
                        if (prev.length === 0) return prev;
                        return [
                            ...prev.slice(0, -1), 
                            [prev[prev.length - 1][0], prev[prev.length - 1][1], ragDoc]
                        ];
                    });  
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

    const handleHistoryChoose = (index: number) => {
        setLoadingHistory(true);

        const idx = chatHistories.length - index - 1;
        const his = chatHistories[idx];
        jsonClient.get(`/chatbot/history?id=${his.chatId}`)
            .then(res => {
                setCurrentHistory(res.data);
                if (window.innerWidth < 1120)
                    setShowNavBar(false);
            }).catch(err => {
                handleNetworkError(err, addAlert);
                if (err.response.status === 401)
                    redirect('/auth/login');
                else if (err.response.status === 504 || err.response.status === 505)
                    redirect('/');
            }).finally(() => {
                setChatId(his.chatId);
                setChatHistories((prev) => (
                    prev.map((history, i) => ({
                        ...history,
                        selected: i === idx,
                    }))
                ));
                setLoadingHistory(false);
            });
    }
    
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

    const handleDelete = (index: number) => {
        setLoadingHistory(true);

        const idx = chatHistories.length - index - 1;
        const his = chatHistories[idx];
        jsonClient.post(`/chatbot/delete`,
            his.chatId
        ).then(_ => {
            setChatHistories((prev) => (
                prev.filter((_, i) => i !== idx)
            ));
            handleNewChat();
        }).catch(err => {
            handleNetworkError(err, addAlert);
            if (err.response.status === 401)
                redirect('/auth/login');
            else if (err.response.status === 504 || err.response.status === 505)
                redirect('/');
        }).finally(() => {
            setLoadingHistory(false);
        });
    }

    const handlePromptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const textarea = e.target;
        setPrompt(textarea.value);

        textarea.style.height = "auto";
        textarea.style.height = `${Math.min(textarea.scrollHeight, 160)}px`;
    }

    const handlePrompt = async() => {
        setProcessing(true);

        const query = prompt;
        setCurrentHistory(prev => [
            ...prev,
            [query, '']
        ]);
        setPrompt('');

        const textarea = document.getElementById("prompt") as HTMLTextAreaElement;
        if (textarea) {
            textarea.style.height = "auto";
        }

        jsonClient.post('/chatbot/prompt',
            {
                query: query,
                rag: rag,
                id: chatId,
            }
        ).then((res) => {
            if (!chatId) {
                setChatHistories((prev) => [
                    ...(prev.map((history) => ({
                        ...history,
                        selected: false,
                    }))),
                    {
                        chatId: res.data.id,
                        title: query,
                        selected: true,
                    }
                ]);
            }
            setChatId(res.data.id);
            connectWebsocket(res.data.id);
        }).catch((err) => {
            handleNetworkError(err, addAlert);
            if (err.response.status === 401)
                redirect('/auth/login');
            else if (err.response.status === 504 || err.response.status === 505)
                redirect('/');
        });
    }
    
    const handlePromptKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handlePrompt();
        }
    };
    
    const handleNewChat = () => {
        setChatId('');
        setCurrentHistory([]);
    };

    return (
        <div className="h-screen w-full py-16 px-2">
            <div className="w-full h-full flex rounded-lg bg-white dark:bg-gray-800">
                <div className={`${showNavBar ? 'visible' : 'hidden'} w-80`}>
                    <ChatbotNavbarCard model={model} setModel={setModel} disabled={loadingHistory} chatbotHistories={chatHistories} onHistoryChoose={handleHistoryChoose} onNewChat={handleNewChat} onDelete={handleDelete} />
                </div>
                <div className="relative w-full h-full flex flex-col items-center">
                    <div className="w-full">
                        <button type="button" onClick={() => setShowNavBar(!showNavBar)} className={`w-12 h-12 m-2 bg-gray-300 dark:bg-gray-700 p-2 rounded-lg flex justify-center items-center hover:text-gray-900 dark:hover:text-white text-gray-500 dark:text-gray-500 active:text-gray-900 dark:active:text-white`}>
                            {showNavBar ? <XMarkIcon className="w-10 h-10" /> : <Bars3Icon className="w-10 h-10" />}
                        </button>
                    </div>
                    {(window.innerWidth >= 1120 || !showNavBar) && <div className='w-full flex flex-col gap-8 max-w-3xl p-2 overflow-y-auto h-full'>
                        {currentHistory && currentHistory.map((chat: any, index: number) => (
                            <div key={index} className="flex gap-3 flex-col w-full items-end">
                                {chat[0] && <div className="max-w-sm flex">
                                    <MarkdownPreviewer user text={chat[0]} />
                                </div>}
                                {chat[1] && <MarkdownPreviewer text={chat[1]} />}
                                {chat[2] && <RagDocPreviewer doc={chat[2]} />}
                            </div>
                        ))}
                    </div>}
                    {(window.innerWidth >= 1120 || !showNavBar) && <div className="max-w-3xl w-full gap-2 flex flex-col mb-2 px-2 py-2 bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700">
                        <textarea
                            name="prompt"
                            id="prompt"
                            value={prompt}
                            disabled={processing}
                            onChange={handlePromptChange}
                            onKeyDown={handlePromptKeyDown}
                            placeholder="Type your prompt here..."
                            className="w-full p-2 text-sm h-auto bg-gray-50 border border-gray-300 rounded-lg resize-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                            rows={2}
                        />
                        <div className="w-full flex justify-between">
                            <div className={`h-10 flex items-center gap-2 cursor-pointer 
                                ${rag ? 'text-blue-700 dark:text-blue-400' : 'text-gray-900 dark:text-white hover:text-blue-700 dark:hover:text-blue-400'}`}
                                onClick={() => setRag(!rag)}>
                                <GlobeAltIcon className="w-6 h-6" />
                                Search
                            </div>
                            <button
                                type="submit"
                                disabled={processing}
                                onClick={handlePrompt}
                                className="w-12 h-10 flex justify-center items-center text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 disabled:bg-blue-700 dark:disabled:bg-blue-700"
                            >
                                {processing ? <svg aria-hidden="true" role="status" className="inline w-4 h-4 text-white animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB"/>
                                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor"/>
                                </svg> : <ArrowUpCircleIcon className="w-6 h-6" />}
                            </button>
                        </div>
                    </div>}
                    {loadingHistory && <div className="absolute max-w-3xl w-full h-full px-2 flex justify-center items-center rounded-lg backdrop-blur-xl">
                        <LoadingSpin className='w-20 h-20' />
                    </div>}
                </div>
            </div>
        </div>
    )
};

export default Chatbot;
