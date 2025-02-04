import { useSaveUnityBackgroundMode } from '@app/global';
import { useRedirectionHelper } from '@app/helpers';

export const TransparentButton1 = (props: any) => {
    const redirect = useRedirectionHelper();
    const saveUnityBackgroundMode = useSaveUnityBackgroundMode();

    return (
        <div {...props}>
            <button type='button' className='w-full h-full items-center transition-all duration-300 cursor-pointer flex justify-center text-gray-500 dark:text-gray-500 border-transparent dark:border-transparent hover:text-gray-900 dark:hover:text-gray-100'
                onClick={(() => {
                    saveUnityBackgroundMode('garden');
                    redirect(`${props.path}`);
                })}>
                {props.label}
            </button>
        </div>
    );
};

export const TransparentButton2 = (props: any) => {
    return (
        <button type='button' className='cursor-pointer transition-all duration-300 text-xl text-gray-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-600'
            onClick={props.onClick}>{props.children}</button>
    )
}