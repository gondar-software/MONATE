import { createContext } from "react";
import { MonateMark, AuthInfo } from "@app/components";
import { useLightMode } from "@app/global";

const HeaderContext = createContext<any | undefined>(undefined);

export const HeaderProvider = (props: any) => {
    const lightMode = useLightMode();

    return (
        <HeaderContext.Provider value={{}}>
            {props.children}
            <div className={`fixed top-0 w-full h-14 flex items-center justify-between px-8 bg-opacity-40 backdrop-blur-md \
                ${lightMode ? 'bg-white' : 'bg-gray-900'}`}>
                <MonateMark />
                <AuthInfo className='justify-between' />
            </div>
        </HeaderContext.Provider>
    );
};

export default HeaderProvider;