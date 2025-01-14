import { LoadingSpin } from "@app/components";

export const LoadingMonate = () => {
    return (
        <div className='flex justify-center items-center h-screen dark:invert text-9xl'>
            <div className='hidden md:flex'>
                <div className='h-32 w-32 items-center'><LoadingSpin /></div>
                &nbsp;
                <div className='h-24 text-center text-7xl font-calibri text-black rounded-full flex-col'>
                    <div>MONATE</div>
                    <div className='text-black text-3xl font-bold font-calibri animate-pulse'>Loading...</div>
                </div>
            </div>
            <div className='md:hidden flex-col'>
                <div className='h-20 w-20 justify-self-center'><LoadingSpin /></div>
                <div className='text-black text-3xl font-bold font-calibri animate-pulse'>Loading...</div>
            </div>
        </div>
    );
};

export default LoadingMonate;