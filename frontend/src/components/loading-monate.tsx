import { LoadingSpin } from "@app/components";

export const LoadingMonate = (props: any) => {
    return (
        <div {...props}>
            <div className="h-full w-full items-center justify-center flex">
                <div className='hidden md:flex'>
                    <div className='h-32 w-32 items-center'><LoadingSpin /></div>
                    &nbsp;
                    <div className='h-24 text-center text-7xl font-calibri text-black rounded-full flex-col'>
                        <div>MONATE</div>
                        {props.progress ?
                            <div className='text-black text-3xl font-bold font-calibri animate-pulse'>{props.progress}%</div>
                            :
                            <div className='text-black text-3xl font-bold font-calibri animate-pulse'>Loading...</div>
                        }
                    </div>
                </div>
                <div className='md:hidden flex-col'>
                    <div className='h-20 w-20 justify-self-center'><LoadingSpin /></div>
                    {props.progress ?
                        <div className='text-black text-3xl font-bold font-calibri animate-pulse'>{props.progress}%</div>
                        :
                        <div className='text-black text-3xl font-bold font-calibri animate-pulse'>Loading...</div>
                    }
                </div>
            </div>
        </div>
    );
};

export default LoadingMonate;