import { TrashIcon } from "@heroicons/react/24/solid";

export const ChatbotNavbarCard = (props: any) => {
    return (
        <div className="flex flex-col w-full h-full bg-white border border-gray-200 rounded-lg shadow p-8 dark:bg-gray-800 dark:border-gray-700">
            <div className="left-6 font-calibri text-3xl text-gray-900 dark:text-white">
                Qwen 2.5
            </div>
            <button
                disabled={props.disabled}
                type="button"
                onClick={props.onNewChat}
                className="w-full text-left bg-transparent dark:bg-transparent disabled:bg-transparent dark:disabled:bg-transparent ml-4 mr-2 px-6 py-1 mt-6 mb-4 text-gray-900 dark:text-white rounded-lg cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600"
            >
                New Chat
            </button>
            <div className="w-full h-1 ml-4 mr-2 px-3 mb-3 bg-gray-400" />
            <div className="w-full h-full overflow-y-auto pr-4 pl-2 overflow-x-hidden pb-2">
                {props.chatbotHistories &&
                    props.chatbotHistories
                        .slice()
                        .reverse()
                        .map((chatbotHistory: any, index: number) => (
                            <div key={index} className="relative">
                                <div
                                    className={`flex flex-row items-center w-full ml-4 mr-2 pr-2 pl-5 py-1 mb-2 text-gray-900 dark:text-white rounded-lg cursor-pointer 
                                        ${chatbotHistory.selected ? 'bg-gray-300 dark:bg-gray-500' : (props.disabled ? '' : 'hover:bg-gray-200 dark:hover:bg-gray-600')}`}
                                >
                                    <div
                                        className="w-full truncate text-left"
                                        onClick={() => {
                                            if (!props.disabled)
                                                props.onHistoryChoose(index)
                                            }}
                                    >
                                        {chatbotHistory.title}
                                    </div>
                                    <button
                                        type='button'
                                        onClick={() => props.onDelete(index)} 
                                        className="p-2 text-transparent hover:text-red-500 dark:text-transparent dark:hover:text-red-400 transition-colors duration-200">
                                        <TrashIcon className="w-4 h-4 " />
                                    </button>
                                </div>
                            </div>
                        ))}
            </div>
        </div>
    );
};

export default ChatbotNavbarCard;
