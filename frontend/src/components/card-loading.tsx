import { LoadingSpin } from "@app/components";
import { useLightMode } from "@app/global";

export const CardLoading = (props: any) => {
    const lightMode = useLightMode();

    return (
        <div {...props}>
            <div className={`h-full w-full items-center justify-center flex ${lightMode ? 'bg-white' : 'bg-gray-900'}`}>
                <div className='flex-col'>
                    <div className='h-20 w-20 justify-self-center'><LoadingSpin /></div>
                    {props.progress ?
                        <div className={`text-3xl font-bold font-calibri animate-pulse ${lightMode ? 'text-gray-900' : 'text-white'}`}>{props.progress}%</div>
                        :
                        <div className={`text-3xl font-bold font-calibri animate-pulse ${lightMode ? 'text-gray-900' : 'text-white'}`}>Loading...</div>
                    }
                </div>
            </div>
        </div>
    );
};

export default CardLoading;