import { MonateIcon } from "./svg-icons";

const LoadingMonate = () => {
    return (
        <div className='flex justify-center items-center bg-transparent h-screen dark:invert'>
            <span className='sr-only'>Loading...</span>
            <div className='h-20 w-20 items-center animate-bounce [animation-delay:-0.6s]'><MonateIcon /></div>
            <div className='h-20 w-16 text-center text-7xl font-bold font-calibri text-black rounded-full animate-bounce [animation-delay:-0.5s]'>O</div>
            <div className='h-20 w-16 text-center text-7xl font-bold font-calibri text-black rounded-full animate-bounce [animation-delay:-0.4s]'>N</div>
            <div className='h-20 w-16 text-center text-7xl font-bold font-calibri text-black rounded-full animate-bounce [animation-delay:-0.3s]'>A</div>
            <div className='h-20 w-16 text-center text-7xl font-bold font-calibri text-black rounded-full animate-bounce [animation-delay:-0.2s]'>T</div>
            <div className='h-20 w-16 text-center text-7xl font-bold font-calibri text-black rounded-full animate-bounce [animation-delay:-0.1s]'>E</div>
        </div>
    );
};

export default LoadingMonate;