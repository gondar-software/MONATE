import { useState, MouseEvent, useEffect } from "react";
import { UnityBackground } from "@app/controls";
import { 
    useGardenLoaded, 
    useOasisLoaded, 
    useGardenProgress, 
    useOasisProgress,
    useLightMode,
} from "@app/global";
import { LoadingMonate, MonateIcon } from "@app/components";

export const Preface = () => {
    const gardenLoaded = useGardenLoaded();
    const oasisLoaded = useOasisLoaded();
    const gardenProgress = useGardenProgress();
    const oasisProgress = useOasisProgress();
    const lightMode = useLightMode();

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
        if (!hasInteracted && gardenLoaded && oasisLoaded) {
            setHasInteracted(true);
        }
    };

    useEffect(() => {
        const intervalId = setInterval(() => {
            setCurrentWord((prev) => (prev + 1) % words.length);
        }, 1000);

        return () => clearInterval(intervalId);
    }, []);

    return (
        <div
            className="w-screen h-screen left-0 top-0 relative"
            onMouseMove={handleMouseMove}
        >
            <UnityBackground name="oasis" className="w-full h-full" />
            {!(gardenLoaded && oasisLoaded) && (
                <LoadingMonate
                    className="w-full h-full absolute left-0 top-0"
                    progress={(gardenProgress + oasisProgress) / 2}
                />
            )}
            <div className={`w-full h-full absolute left-0 top-0 transition-all duration-500 \
                ${hasInteracted ? (lightMode ? 'bg-white bg-opacity-50' : 'bg-black bg-opacity-80') : 'bg-transparent'}`} />
            {hasInteracted && <div className="w-full h-full left-0 top-0">
                <div className="w-1/5 h-1/5 left-10 top-10 absolute flex">
                    <MonateIcon className='w-10 h-10' />
                    <div className={`text-4xl font-bold underline ${lightMode ? 'text-gray-900' : 'text-white'}`}>ONATE</div>
                </div>
                <div className={`w-full h-1/2 absolute left-0 top-1/4 text-center \
                    ${lightMode ? 'text-gray-900' : 'text-white'}`}>
                    <div className='text-7xl'>Demand more out of your</div>
                    <div className='text-8xl'>{words[currentWord]}.</div>
                </div>
            </div>}
        </div>
    );
};

export default Preface;