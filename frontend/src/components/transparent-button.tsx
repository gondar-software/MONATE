import { useSaveUnityBackgroundMode } from '@app/global';
import { useRedirectionHelper } from '@app/helpers';

export const TransparentButton = (props: any) => {
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

export default TransparentButton;