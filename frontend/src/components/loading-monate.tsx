import { MonateIcon } from "./svg-icons";

const LoadingMonate = () => {
    return (
        <div className='flex justify-center items-center h-screen dark:invert'>
            <div className='hidden md:flex'>
                <div className='h-20 w-20 items-center animate-bounce [animation-delay:-0.6s]'><MonateIcon /></div>
                <div className='h-20 w-16 text-center text-7xl font-bold font-calibri text-black rounded-full animate-bounce [animation-delay:-0.5s]'>O</div>
                <div className='h-20 w-16 text-center text-7xl font-bold font-calibri text-black rounded-full animate-bounce [animation-delay:-0.4s]'>N</div>
                <div className='h-20 w-16 text-center text-7xl font-bold font-calibri text-black rounded-full animate-bounce [animation-delay:-0.3s]'>A</div>
                <div className='h-20 w-16 text-center text-7xl font-bold font-calibri text-black rounded-full animate-bounce [animation-delay:-0.2s]'>T</div>
                <div className='h-20 w-16 text-center text-7xl font-bold font-calibri text-black rounded-full animate-bounce [animation-delay:-0.1s]'>E</div>
            </div>
            <div className='md:hidden flex-col'>
                <div className='h-20 w-20 animate-bounce justify-self-center [animation-delay:-0.6s]'><MonateIcon /></div>
                <div className='text-black text-3xl font-bold font-calibri animate-pulse'>Loading...</div>
            </div>
        </div>
    );
};

export default LoadingMonate;