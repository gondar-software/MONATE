import { useSaveVideoBackgroundMode } from '@app/global';
import { useRedirectionHelper } from '@app/helpers';
import { FormCancelButton1Props, FormLinkButton1Props, FormLinkButton2Props, FormSubmitButton1Props, TransparentButton1Props, TransparentButton2Props } from '@app/types';

export const TransparentButton1 = (props: TransparentButton1Props) => {
    const redirect = useRedirectionHelper();
    const saveVideoBackgroundMode = useSaveVideoBackgroundMode();

    return (
        <div className={props.className}>
            <button type='button' className='w-full h-full items-center transition-all duration-300 cursor-pointer flex justify-center text-gray-500 dark:text-gray-500 border-transparent dark:border-transparent hover:text-gray-900 dark:hover:text-gray-100'
                onClick={(() => {
                    saveVideoBackgroundMode(1);
                    redirect(`${props.url}`);
                })}>
                {props.label}
            </button>
        </div>
    );
};

export const TransparentButton2 = (props: TransparentButton2Props) => {
    return (
        <button type='button' className='cursor-pointer transition-all duration-300 text-xl text-gray-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-600'
            onClick={props.onClick}>{props.children}</button>
    )
}

export const FormSubmitButton1 = (props: FormSubmitButton1Props) => {
    return (
        <button
            type="submit"
            disabled={props.submitting}
            className="w-full flex justify-center items-center text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
            {props.submitting && <svg aria-hidden="true" role="status" className="inline w-4 h-4 me-3 text-white animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB"/>
                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor"/>
            </svg>}
            {props.children}
        </button>
    )
}

export const FormCancelButton1 = (props: FormCancelButton1Props) => {
    return (
        <button
            type="button"
            className="w-full flex justify-center items-center text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800"
            onClick={props.onCancel}
        >
            {props.children}
        </button>
    )
}

export const FormLinkButton1 = (props: FormLinkButton1Props) => {
    return (
        <a 
            href={props.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-normal text-gray-900 dark:text-white">
            {props.icon ? 
                <span className="flex items-center cursor-pointer">
                    {props.icon}&nbsp;
                    <div className="w-full truncate">{props.children}</div>
                </span>
                : <div className="w-full truncate cursor-pointer">{props.children}</div>}
        </a>
    )
}

export const FormLinkButton2 = (props: FormLinkButton2Props) => {
    return (
        <a 
            href={props.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-md w-full font-normal text-gray-900 dark:text-white hover:text-blue-500 dark:hover:text-cyan-300 transition-colors duration-200"
        >
            {props.children}
        </a>
    )
}