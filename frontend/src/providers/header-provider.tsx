import { createContext } from "react";
import { MonateMark, AuthInfo, ModeSwitch } from "@app/components";
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
                <div className='flex gap-8'>
                    <AuthInfo className='justify-between' />
                    <ModeSwitch className='w-8 h-8' />
                </div>
            </div>
        </HeaderContext.Provider>
    );
};

export default HeaderProvider;