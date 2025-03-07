import { createContext, useContext, useState } from "react";
import { MonateMark, AuthInfo, ModeSwitch } from "@app/components";
import { HeaderProviderProps } from "@app/types";

const HeaderContext = createContext<any | undefined>(undefined);

export const HeaderProvider = (props: HeaderProviderProps) => {
    const [authInfo, setAuthInfo] = useState<boolean>(true);

    const showAuthInfo = () => {
        setAuthInfo(true);
    }
    const hideAuthInfo = () => {
        setAuthInfo(false);
    }

    return (
        <HeaderContext.Provider value={{showAuthInfo, hideAuthInfo}}>
            {props.children}
            <div className='fixed top-0 right-0 w-full h-14 flex items-center justify-between px-8 bg-opacity-40 dark:bg-opacity-40 backdrop-blur-md bg-gray-100 dark:bg-gray-900 transition-all duration-300'>
                <MonateMark />
                <div className='flex gap-8 items-center'>
                    {authInfo && <AuthInfo className='justify-between' />}
                    <ModeSwitch className='w-8 h-8' />
                </div>
            </div>
        </HeaderContext.Provider>
    );
};

export const useHeader = () => {
    return useContext(HeaderContext);
}

export default HeaderProvider;