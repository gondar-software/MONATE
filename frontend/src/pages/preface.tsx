import { useState, useEffect } from "react";
import { 
    useLightMode,
    useSaveVideoBackgroundMode,
} from "@app/global";
import { TransparentButton1 } from "@app/components";
import { routes } from '@app/routes';
import { useHeader, useLoading } from "@app/providers";

export const Preface = () => {
    const lightMode = useLightMode();
    const saveVideoBackgroundMode = useSaveVideoBackgroundMode();

    const { showAuthInfo } = useHeader();
    const { hideLoading } = useLoading();

    const words = [
        'Websites',
        'Mobile Apps',
        'GenAI Tools',
        'Chatbots',
        'Automations',
    ];
    const [currentWord, setCurrentWord] = useState(0);

    useEffect(() => {
        saveVideoBackgroundMode(0);
        showAuthInfo();
        hideLoading();
    }, []);

    useEffect(() => {
        const intervalId = setInterval(() => {
            setCurrentWord((prev) => (prev + 1) % words.length);
        }, 1500);

        return () => clearInterval(intervalId);
    }, []);

    return (
        <div className={`w-full left-0 xl:mt-52 lg:mt-56 mt-48 text-center justify-items-center 
            ${lightMode ? 'text-gray-900' : 'text-white'}`}>
            <div className='xl:text-7xl md:text-6xl text-5xl'>Demand more out of your</div>
            <div className='xl:text-8xl md:text-7xl text-6xl'>{words[currentWord]}.</div>
            <div className='hidden lg:flex origin-center text-xl overflow-hidden mt-20'>
                {routes.filter(layout => layout.layout === '/client')[0].pages.map((page, index) => (
                    <TransparentButton1 className='h-12 w-48' key={index} label={page.label} path={`client${page.path}`} />
                ))}
            </div>
            <div className='lg:hidden flex-col origin-center text-xl overflow-hidden mt-20'>
                {routes.filter(layout => layout.layout === '/client')[0].pages.map((page, index) => (
                    <TransparentButton1 className='h-12 w-48' key={index} label={page.label} path={`client${page.path}`} />
                ))}
            </div>
            <TransparentButton1 className='w-72 h-16 text-4xl overflow-hidden mt-12' label='Book me' path='contact/book-me' />
            <div className='h-36' />
        </div>
    );
};

export default Preface;