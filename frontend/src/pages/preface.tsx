import { useState, MouseEvent, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
    useOasisLoaded, 
    useOasisProgress,
    useGardenLoaded,
    useGardenProgress,
    useLightMode,
    useSaveUnityBackgroundMode,
} from "@app/global";
import { LoadingMonate, MonateIcon, CopyrightIcon } from "@app/components";
import { routes } from '@app/routes';

export const Preface = () => {
    const oasisLoaded = useOasisLoaded();
    const oasisProgress = useOasisProgress();
    const gardenLoaded = useGardenLoaded();
    const gardenProgress = useGardenProgress();
    const lightMode = useLightMode();
    const saveUnityBackgroundMode = useSaveUnityBackgroundMode();
    const navigate = useNavigate();

    const words = [
        'Websites',
        'Mobile Apps',
        'Generation Tools',
        'Chatbots',
        'AI Models',
    ];

    const [hasInteracted, setHasInteracted] = useState(false);
    const [currentWord, setCurrentWord] = useState(0);

    const handleMouseMove = (_: MouseEvent<HTMLDivElement>): void => {
        if (!hasInteracted && oasisLoaded && gardenLoaded) {
            setHasInteracted(true);
        }
    };

    useEffect(() => {
        saveUnityBackgroundMode('oasis');
    })

    useEffect(() => {
        const intervalId = setInterval(() => {
            setCurrentWord((prev) => (prev + 1) % words.length);
        }, 1500);

        return () => clearInterval(intervalId);
    }, []);

    return (
        <div
            className="w-screen h-screen left-0 top-0 relative"
            onMouseMove={handleMouseMove}
        >
            {!(oasisLoaded && gardenLoaded) && (
                <LoadingMonate
                    className="w-full h-full absolute left-0 top-0"
                    progress={(oasisProgress + gardenProgress) / 2.}
                />
            )}
            <div className={`w-full h-full absolute left-0 top-0 transition-all duration-500 \
                ${hasInteracted ? (lightMode ? 'bg-white bg-opacity-50' : 'bg-black bg-opacity-80') : 'bg-transparent'}`} />
            {hasInteracted && <div className="w-full h-full left-0 top-0 absolute">
                <div className="h-1/5 left-10 top-10 absolute flex">
                    <MonateIcon className='w-10 h-10' />
                    <div className={`text-4xl font-bold underline ${lightMode ? 'text-gray-900' : 'text-white'}`}>ONATE</div>
                </div>
                <div className={`w-full h-1/3 absolute left-0 xl:top-1/4 md:top-36 sm:top-28 top-24 text-center justify-items-center \
                    ${lightMode ? 'text-gray-900' : 'text-white'}`}>
                    <div className='text-7xl'>Demand more out of your</div>
                    <div className='text-8xl'>{words[currentWord]}.</div>
                    <div className='h-20' />
                    <div className='rounded-xl hidden lg:flex origin-center text-xl overflow-hidden'>
                        {routes.filter(layout => layout.layout === 'client')[0].pages.map((page) => (
                            <div className={`h-12 w-48 items-center rounded-none transition-all duration-300 cursor-pointer flex justify-center
                                ${lightMode ? 'hover:border-white hover:bg-white hover:opacity-50 active:opacity-100'
                                    : 'hover:border-gray-900 hover:bg-gray-900 hover:opacity-70 active:opacity-100'}`}
                                onClick={(() => {
                                    saveUnityBackgroundMode('garden');
                                    navigate(`client${page.path}`);
                                })}>
                                {page.label}
                            </div>
                        ))}
                    </div>
                    <div className='rounded-xl lg:hidden flex-col origin-center text-xl overflow-hidden'>
                    {routes.filter(layout => layout.layout === 'client')[0].pages.map((page) => (
                            <div className={`h-12 w-48 items-center rounded-none transition-all duration-300 cursor-pointer flex justify-center
                                ${lightMode ? 'hover:border-white hover:bg-white hover:opacity-50 active:opacity-100'
                                    : 'hover:border-gray-900 hover:bg-gray-900 hover:opacity-70 active:opacity-100'}`}
                                onClick={(() => {
                                    saveUnityBackgroundMode('garden');
                                    navigate(`client${page.path}`);
                                })}>
                                {page.label}
                            </div>
                        ))}
                    </div>
                    <div className='h-12' />
                    <div className={`w-72 h-16 rounded-xl text-4xl items-center transition-all duration-300 cursor-pointer flex justify-center
                                ${lightMode ? 'hover:border-white hover:bg-white hover:opacity-50 active:opacity-100'
                                    : 'hover:border-gray-900 hover:bg-gray-900 hover:opacity-70 active:opacity-100'}`}>Book me</div>
                </div>
                <div className="absolute bottom-0 w-full flex justify-center items-center py-4">
                    <CopyrightIcon className="w-6 h-6 mr-2" />
                    <span>2024 Copyright by MONATE. All rights reserved.</span>
                </div>
            </div>}
        </div>
    );
};

export default Preface;