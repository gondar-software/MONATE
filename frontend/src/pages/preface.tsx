import { useState, MouseEvent } from "react";
import { UnityBackground } from "@app/controls";
import { 
    useGardenLoaded, 
    useOasisLoaded, 
    useGardenProgress, 
    useOasisProgress,
    useLightMode,
} from "@app/global";
import { LoadingMonate } from "@app/components";

export const Preface = () => {
    const [hasInteracted, setHasInteracted] = useState(false);

    const gardenLoaded = useGardenLoaded();
    const oasisLoaded = useOasisLoaded();
    const gardenProgress = useGardenProgress();
    const oasisProgress = useOasisProgress();
    const lightMode = useLightMode();

    const handleMouseMove = (_: MouseEvent<HTMLDivElement>): void => {
        if (!hasInteracted && gardenLoaded && oasisLoaded) {
            setHasInteracted(true);
        }
    };

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
        </div>
    );
};

export default Preface;