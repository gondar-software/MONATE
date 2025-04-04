import { BadgeProps } from "@app/types";

export const Badge = (props: BadgeProps) => {
    return (
        <span className={`text-xs h-full font-medium me-2 px-2.5 py-0.5 rounded border flex items-center justify-center text-center 
            ${props.type === 'blue' && 'bg-blue-100 text-blue-800 dark:text-blue-400 border-blue-400 dark:bg-blue-900'} 
            ${props.type === 'gray' && 'bg-gray-100 text-gray-800 dark:text-gray-400 border-gray-400 dark:bg-gray-900'} 
            ${props.type === 'red' && 'bg-red-100 text-red-800 dark:text-red-400 border-red-400 dark:bg-red-900'} 
            ${props.type === 'green' && 'bg-green-100 text-green-800 dark:text-green-400 border-green-400 dark:bg-green-900'} 
            ${props.type === 'yellow' && 'bg-yellow-100 text-yellow-800 dark:text-yellow-400 border-yellow-400 dark:bg-yellow-900'} 
            ${props.type === 'indigo' && 'bg-indigo-100 text-indigo-800 dark:text-indigo-400 border-indigo-400 dark:bg-indigo-900'} 
            ${props.type === 'purple' && 'bg-purple-100 text-purple-800 dark:text-purple-400 border-purple-400 dark:bg-purple-900'} 
            ${props.type === 'pink' && 'bg-pink-100 text-pink-800 dark:text-pink-400 border-pink-400 dark:bg-pink-900'} 
            `}>
            {props.name}
            {!props.hiddenRemoveButton && <button type="button" className={`inline-flex items-center p-1 ms-2 text-sm bg-transparent rounded-sm 
                ${props.type === 'blue' && 'text-blue-400 hover:bg-blue-200 hover:text-blue-900 dark:hover:bg-blue-800 dark:hover:text-blue-300'} 
                ${props.type === 'gray' && 'text-gray-400 hover:bg-gray-200 hover:text-gray-900 dark:hover:bg-gray-800 dark:hover:text-gray-300'} 
                ${props.type === 'red' && 'text-red-400 hover:bg-red-200 hover:text-red-900 dark:hover:bg-red-800 dark:hover:text-red-300'} 
                ${props.type === 'green' && 'text-green-400 hover:bg-green-200 hover:text-green-900 dark:hover:bg-green-800 dark:hover:text-green-300'} 
                ${props.type === 'yellow' && 'text-yellow-400 hover:bg-yellow-200 hover:text-yellow-900 dark:hover:bg-yellow-800 dark:hover:text-yellow-300'} 
                ${props.type === 'indigo' && 'text-indigo-400 hover:bg-indigo-200 hover:text-indigo-900 dark:hover:bg-indigo-800 dark:hover:text-indigo-300'} 
                ${props.type === 'purple' && 'text-purple-400 hover:bg-purple-200 hover:text-purple-900 dark:hover:bg-purple-800 dark:hover:text-purple-300'} 
                ${props.type === 'pink' && 'text-pink-400 hover:bg-pink-200 hover:text-pink-900 dark:hover:bg-pink-800 dark:hover:text-pink-300'} 
                `} data-dismiss-target="#badge-dismiss-default" aria-label="Remove"
                onClick={props.onCloseButtonClick}>
                <svg className="w-2 h-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                </svg>
                <span className="sr-only">Remove badge</span>
            </button>}
        </span>
    );
}