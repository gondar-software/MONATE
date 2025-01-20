import { createContext, useContext } from 'react';
import { UnityGardenControl, UnityOasisControl } from '@app/controls';
import { 
    useUnityBackgroundMode,
    useOasisLoaded,
    useOasisProgress,
    useGardenLoaded,
    useGardenProgress,
} from '@app/global';
import { LoadingMonate } from '@app/components';

const UnityBackgroundContext = createContext<any | undefined>(undefined);

export const UnityBackgroundProvider = ({ children }: any) => {
    const unityBackgroundMode = useUnityBackgroundMode();
    const oasisLoaded = useOasisLoaded();
    const oasisProgress = useOasisProgress();
    const gardenLoaded = useGardenLoaded();
    const gardenProgress = useGardenProgress();

    return(
        <UnityBackgroundContext.Provider value={{}}>
            <div className='fixed w-full h-full left-0 top-0'>
                <UnityGardenControl className={`w-full h-full absolute ${unityBackgroundMode === 'garden' ? 'visible' : 'hidden'}`} />
                <UnityOasisControl className={`w-full h-full absolute ${unityBackgroundMode === 'oasis' ? 'visible' : 'hidden'}`} />
            </div>
            {!(oasisLoaded && gardenLoaded) ? (
                <LoadingMonate
                    className="w-full h-full absolute left-0 top-0"
                    progress={(oasisProgress + gardenProgress) / 2.}
                />
            ) : children}
        </UnityBackgroundContext.Provider>
    );
};

export const useUnityBackground = () => {
    return useContext(UnityBackgroundContext);
};

export default UnityBackgroundProvider;