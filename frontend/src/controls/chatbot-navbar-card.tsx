import { FormSelect1 } from "@app/components";
import { ChatbotHistoryData, ChatbotModelType, ChatbotNavbarCardProps } from "@app/types";
import { TrashIcon } from "@heroicons/react/24/solid";

export const ChatbotNavbarCard = (props: ChatbotNavbarCardProps) => {
    return (
        <div className="flex flex-col w-80 h-full bg-white border border-gray-200 rounded-lg shadow p-8 dark:bg-gray-800 dark:border-gray-700">
            <FormSelect1
                value={props.model}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => 
                    props.setModel(e.target.value as ChatbotModelType)}
                options={
                    [
                        { value: 'open-ai', label: 'OpenAI' }, 
                        { value: 'qwen', label: 'Qwen' }, 
                    ]}
            />
            <button
                disabled={props.disabled}
                type="button"
                onClick={props.onNewChat}
                className="w-full text-left bg-transparent dark:bg-transparent disabled:bg-transparent dark:disabled:bg-transparent px-6 py-2 mt-6 mb-4 text-gray-900 dark:text-white rounded-lg cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600"
            >
                New Chat
            </button>
            <div className="w-full h-1 px-3 mb-3 bg-gray-400" />
            <div className="w-full h-full overflow-y-auto pr-4 pl-2 overflow-x-hidden pb-2">
                {props.chatbotHistories &&
                    props.chatbotHistories
                        .slice()
                        .reverse()
                        .map((chatbotHistory: ChatbotHistoryData, index: number) => (
                            <div key={index} className="relative">
                                <div
                                    className={`flex flex-row items-center w-full pr-2 pl-5 py-1 mb-2 text-gray-900 dark:text-white rounded-lg cursor-pointer 
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
