import { useLightMode } from '@app/global';
import { useSaveUnityBackgroundMode } from '@app/global';
import { useRedirectionHelper } from '@app/helpers';

export const TransparentButton = (props: any) => {
    const lightMode = useLightMode();
    const redirect = useRedirectionHelper();
    const saveUnityBackgroundMode = useSaveUnityBackgroundMode();

    return (
        <div {...props}>
            <div className={`w-full h-full items-center transition-all duration-300 cursor-pointer flex justify-center
                ${lightMode ? 'hover:border-white hover:bg-white hover:opacity-50 active:opacity-100'
                    : 'hover:border-gray-900 hover:bg-gray-900 hover:opacity-70 active:opacity-100'}`}
                onClick={(() => {
                    saveUnityBackgroundMode('garden');
                    redirect(`${props.path}`);
                })}>
                {props.label}
            </div>
        </div>
    );
};

export default TransparentButton;