import { createContext, useState } from 'react';
import { UnityGardenControl, UnityOasisControl } from '@app/controls';
import { 
    useUnityBackgroundMode,
    useOasisLoaded,
    useOasisProgress,
    useGardenLoaded,
    useGardenProgress,
} from '@app/global';
import { LoadingMonate } from '@app/components';
import { UnityBackgroundProviderProps } from '@app/types';

const UnityBackgroundContext = createContext<any | undefined>(undefined);

export const UnityBackgroundProvider = (props: UnityBackgroundProviderProps) => {
    const unityBackgroundMode = useUnityBackgroundMode();
    const oasisLoaded = useOasisLoaded();
    const oasisProgress = useOasisProgress();
    const gardenLoaded = useGardenLoaded();
    const gardenProgress = useGardenProgress();

    const [hasInteracted, setHasInteracted] = useState<boolean>(false);

    const handleMouseMove = (_: React.MouseEvent<HTMLDivElement>) => {
        if (!hasInteracted) {
            setHasInteracted(true);
        }
    };

    return(
        <UnityBackgroundContext.Provider value={{}}>
            <div className='fixed w-full h-full left-0 top-0'>
                <UnityGardenControl className={`w-full h-full absolute ${unityBackgroundMode === 'garden' ? 'visible' : 'hidden'}`} />
                <UnityOasisControl className={`w-full h-full absolute ${unityBackgroundMode === 'oasis' ? 'visible' : 'hidden'}`} />
            </div>
            {!(oasisLoaded && gardenLoaded) && 
                <LoadingMonate
                    className="w-full h-full absolute left-0 top-0"
                    progress={(oasisProgress + gardenProgress) / 2.}
                />}
            <div className={`w-full min-h-screen absolute left-0 top-0 transition-all duration-300 
                ${(oasisLoaded && gardenLoaded) ? 'opacity-100' : 'opacity-0'} 
                ${hasInteracted ? 'bg-gray-100 bg-opacity-80 dark:bg-black dark:bg-opacity-80' : 'bg-transparent'}`}
                onMouseMove={handleMouseMove}>
                {(oasisLoaded && gardenLoaded) && <div className={`w-full min-h-screen left-0 top-0 flex justify-center items-center`}>
                    {props.children}
                </div>}
            </div>
        </UnityBackgroundContext.Provider>
    );
};

export default UnityBackgroundProvider;