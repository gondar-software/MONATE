import { useState, useEffect } from "react";
import { 
    useLightMode,
    useSaveUnityBackgroundMode,
} from "@app/global";
import { Alert, TransparentButton } from "@app/components";
import { routes } from '@app/routes';

export const Preface = () => {
    const lightMode = useLightMode();
    const saveUnityBackgroundMode = useSaveUnityBackgroundMode();

    const words = [
        'Websites',
        'Mobile Apps',
        'Generation Tools',
        'Chatbots',
        'AI Models',
    ];
    const [currentWord, setCurrentWord] = useState(0);

    useEffect(() => {
        saveUnityBackgroundMode('oasis');
    }, [])

    useEffect(() => {
        const intervalId = setInterval(() => {
            setCurrentWord((prev) => (prev + 1) % words.length);
        }, 1500);

        return () => clearInterval(intervalId);
    }, []);

    // return (
    //     <div className={`w-full left-0 xl:mt-52 lg:mt-56 mt-48 text-center justify-items-center items-center \
    //         ${lightMode ? 'text-gray-900' : 'text-white'}`}>
    //         <div className='xl:text-7xl md:text-6xl text-5xl'>Demand more out of your</div>
    //         <div className='xl:text-8xl md:text-7xl text-6xl'>{words[currentWord]}.</div>
    //         <div className='rounded-xl hidden lg:flex origin-center text-xl overflow-hidden mt-20'>
    //             {routes.filter(layout => layout.layout === 'client')[0].pages.map((page, index) => (
    //                 <TransparentButton className='h-12 w-48 rounded-none' key={index} label={page.label} path={`client${page.path}`} />
    //             ))}
    //         </div>
    //         <div className='rounded-xl lg:hidden flex-col origin-center text-xl overflow-hidden mt-20'>
    //             {routes.filter(layout => layout.layout === 'client')[0].pages.map((page, index) => (
    //                 <TransparentButton className='h-12 w-48 rounded-none' key={index} label={page.label} path={`client${page.path}`} />
    //             ))}
    //         </div>
    //         <TransparentButton className='w-72 h-16 rounded-xl text-4xl overflow-hidden mt-12' label='Book me' path='contact/book-me' />
    //         <div className='h-36' />
    //     </div>
    // );

    return (
        <div className="w-full h-screen flex flex-col justify-center items-center dark:bg-gray-900">
            <Alert className='w-1/2' mode='info' message='This website is still under construction.' title='Info' />
            <Alert className='w-1/2' mode='danger' message='This website is still under construction.' title='Danger' />
            <Alert className='w-1/2' mode='warning' message='This website is still under construction.' title='Warning' />
            <Alert className='w-1/2' mode='success' message='This website is still under construction.' title='Success' />
            <Alert className='w-1/2' mode='ignore' message='This website is still under construction.' title='Ignore' />
        </div>
    )
};

export default Preface;