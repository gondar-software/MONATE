import { LoadingSpin } from "@app/components";
import { useLightMode } from "@app/global";

export const LoadingMonate = (props: any) => {
    const lightMode = useLightMode();

    return (
        <div {...props}>
            <div className={`h-full w-full items-center justify-center flex ${lightMode ? 'bg-white' : 'bg-gray-900'}`}>
                <div className='hidden md:flex'>
                    <div className='h-32 w-32 items-center'><LoadingSpin /></div>
                    &nbsp;
                    <div className={`h-24 text-center text-7xl font-calibri rounded-full flex-col ${lightMode ? 'text-gray-900' : 'text-white'}`}>
                        <div>MONATE</div>
                        {props.progress ?
                            <div className={`text-3xl font-bold font-calibri animate-pulse ${lightMode ? 'text-gray-900' : 'text-white'}`}>{props.progress}%</div>
                            :
                            <div className={`text-3xl font-bold font-calibri animate-pulse ${lightMode ? 'text-gray-900' : 'text-white'}`}>Loading...</div>
                        }
                    </div>
                </div>
                <div className='md:hidden flex-col'>
                    <div className='h-20 w-20'><LoadingSpin /></div>
                    {props.progress ?
                        <div className={`text-3xl font-bold text-center font-calibri animate-pulse ${lightMode ? 'text-gray-900' : 'text-white'}`}>{props.progress}%</div>
                        :
                        <div className={`text-3xl font-bold text-center font-calibri animate-pulse ${lightMode ? 'text-gray-900' : 'text-white'}`}>Loading...</div>
                    }
                </div>
            </div>
        </div>
    );
};

export default LoadingMonate;