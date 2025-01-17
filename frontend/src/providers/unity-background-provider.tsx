import { createContext, useContext } from 'react';
import { UnityGardenControl, UnityOasisControl } from '@app/controls';
import { useUnityBackgroundMode } from '@app/global';

const UnityBackgroundContext = createContext<any | undefined>(undefined);

export const UnityBackgroundProvider = ({ children }: any) => {
    const unityBackgroundMode = useUnityBackgroundMode();

    return(
        <UnityBackgroundContext.Provider value={{}}>
            <div className='fixed w-full h-full left-0 top-0'>
                <UnityGardenControl className={`w-full h-full absolute ${unityBackgroundMode === 'garden' ? 'visible' : 'hidden'}`} />
                <UnityOasisControl className={`w-full h-full absolute ${unityBackgroundMode === 'oasis' ? 'visible' : 'hidden'}`} />
            </div>
            {children}
        </UnityBackgroundContext.Provider>
    );
};

export const useUnityBackground = () => {
    return useContext(UnityBackgroundContext);
};

export default UnityBackgroundProvider;