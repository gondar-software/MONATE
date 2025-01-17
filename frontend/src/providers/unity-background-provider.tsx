import { createContext, useState, useContext } from 'react';
import { UnityGardenControl, UnityOasisControl } from '@app/controls';

const UnityBackgroundContext = createContext<any | undefined>(undefined);

export const UnityBackgroundProvider = ({ children }: any) => {
    const [name, setName] = useState<string>('oasis');

    const showUnityBackground = (name: string) => {
        setName(name);
    };

    return(
        <UnityBackgroundContext.Provider value={{ showUnityBackground }}>
            <div className='fixed w-full h-full left-0 top-0'>
                <UnityGardenControl className={`w-full h-full absolute ${name === 'garden' ? 'visible' : 'hidden'}`} />
                <UnityOasisControl className={`w-full h-full absolute ${name === 'oasis' ? 'visible' : 'hidden'}`} />
            </div>
            {children}
        </UnityBackgroundContext.Provider>
    );
};

export const useUnityBackground = () => {
    return useContext(UnityBackgroundContext);
};

export default UnityBackgroundProvider;