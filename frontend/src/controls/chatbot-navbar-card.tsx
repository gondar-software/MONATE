import { EllipsisVerticalIcon } from "@heroicons/react/24/solid";

export const ChatbotNavbarCard = (props: any) => {
    return (
        <div className="max-w-xs flex flex-col w-full h-full bg-white border border-gray-200 rounded-lg shadow p-8 dark:bg-gray-800 dark:border-gray-700">
            <div className="left-6 font-calibri text-3xl text-gray-900 dark:text-white">
                Qwen 2.5
            </div>
            <div className='w-full ml-4 mr-2 px-3 py-1 mt-6 mb-4 text-gray-900 dark:text-white rounded-lg cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600'>
                New Chat
            </div>
            <div className="w-full h-1 ml-4 mr-2 px-3 mb-3 bg-gray-400" />
            <div className="w-full h-full overflow-y-auto pr-4 pl-2 overflow-x-hidden pb-2">
                {props.chatbotHistories && props.chatbotHistories.map((chatbotHistory: any, index: number) => (
                    <div 
                        key={index} 
                        className={`flex flex-row items-center w-full ml-4 mr-2 px-3 py-1 mb-2 text-gray-900 dark:text-white rounded-lg cursor-pointer \
                            ${chatbotHistory.selected ? 'bg-gray-300 dark:bg-gray-500' : 'hover:bg-gray-200 dark:hover:bg-gray-600'}`}>
                            <div className="w-full truncate" onClick={() => props.onHistoryChoose(index)}>
                                {chatbotHistory.title}
                            </div>
                            <EllipsisVerticalIcon className="w-6 h-6" />
                    </div>
                ))}
            </div>
        </div>
    );
}

export default ChatbotNavbarCard;