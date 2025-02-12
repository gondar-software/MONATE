import { 
    InformationCircleIcon, 
    XCircleIcon, 
    ExclamationCircleIcon, 
    CheckCircleIcon, 
    EllipsisHorizontalCircleIcon 
} from "@heroicons/react/24/solid";

export const Alert = (props: any) => {
    return (
        <div {...props}>
            <div className={`p-4 mb-1 text-sm rounded-lg items-center flex dark:bg-gray-800 
                ${props.mode === 'info' && 'dark:text-blue-400 text-blue-800 bg-blue-50'} 
                ${props.mode === 'danger' && 'dark:text-red-400 text-red-800 bg-red-50'} 
                ${props.mode === 'success' && 'dark:text-green-400 text-green-800 bg-green-50'} 
                ${props.mode === 'warning' && 'dark:text-yellow-400 text-yellow-800 bg-yellow-50'} 
                ${props.mode === 'ignore' && 'dark:text-gray-400 text-gray-800 bg-gray-50'}`} role="alert">
                {props.mode === 'info' && <InformationCircleIcon className="w-5 h-5 inline-block mr-2" />}
                {props.mode === 'danger' && <XCircleIcon className="w-5 h-5 inline-block mr-2" />}
                {props.mode === 'success' && <CheckCircleIcon className="w-5 h-5 inline-block mr-2" />}
                {props.mode === 'warning' && <ExclamationCircleIcon className="w-5 h-5 inline-block mr-2" />}
                {props.mode === 'ignore' && <EllipsisHorizontalCircleIcon className="w-5 h-5 inline-block mr-2" />}
                <span className="font-medium">{props.title}:</span>&nbsp;{props.message}
            </div>
        </div>
    );
};

export default Alert;