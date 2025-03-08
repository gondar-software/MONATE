import { LoadingSpin } from "@app/components";
import { LoadingMonateProps } from "@app/types";

export const LoadingMonate = (props: LoadingMonateProps) => {
    return (
        <div className={props.className}>
            <div className='h-full w-full items-center justify-center flex bg-gray-100 dark:bg-gray-900'>
                <div className='hidden md:flex'>
                    <div className='h-32 w-32 items-center'><LoadingSpin /></div>
                    &nbsp;
                    <div className='h-24 text-center text-7xl font-calibri rounded-full flex-col text-gray-900 dark:text-gray-100'>
                        <div>MONATE</div>
                        {props.progress ?
                            <div className='text-3xl font-bold font-calibri animate-pulse text-gray-900 dark:text-gray-100'>{props.progress}%</div>
                            :
                            <div className='text-3xl font-bold font-calibri animate-pulse text-gray-900 dark:text-gray-100'>Loading...</div>
                        }
                    </div>
                </div>
                <div className='md:hidden flex-col'>
                    <div className='h-20 w-20'><LoadingSpin /></div>
                    {props.progress ?
                        <div className='text-3xl font-bold text-center font-calibri animate-pulse text-gray-900 dark:text-gray-100'>{props.progress}%</div>
                        :
                        <div className='text-3xl font-bold text-center font-calibri animate-pulse text-gray-900 dark:text-gray-100'>Loading...</div>
                    }
                </div>
            </div>
        </div>
    );
};

export default LoadingMonate;