import { createContext } from "react";
import { CopyrightIcon } from "@app/components";
import { useLightMode } from "@app/global";

const FooterContext = createContext<any | undefined>(undefined);

export const FooterProvider = (props: any) => {
    const lightMode = useLightMode();

    return (
        <FooterContext.Provider value={{}}>
            {props.children}
            <div className={`fixed bottom-0 w-full flex justify-center items-center py-4 bg-opacity-40 backdrop-blur-md \
                ${lightMode ? 'bg-white' : 'bg-gray-900'}`}>
                <CopyrightIcon className="w-6 h-6 mr-2" />
                <span>2025 Copyright by MONATE. All rights reserved.</span>
            </div>
        </FooterContext.Provider>
    )
}