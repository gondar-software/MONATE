import { createContext } from "react";
import { CopyrightIcon } from "@app/components";
import { FooterProviderProps } from "@app/types";

const FooterContext = createContext<undefined>(undefined);

export const FooterProvider = (props: FooterProviderProps) => {
    return (
        <FooterContext.Provider value={ undefined }>
            {props.children}
            <div className='fixed bottom-0 right-0 w-full flex justify-center items-center py-4 bg-opacity-40 dark:bg-opacity-40 backdrop-blur-md bg-gray-100 dark:bg-gray-900 transition-all duration-300'>
                <CopyrightIcon className="w-6 h-6 mr-2" />
                <span className='text-gray-900 dark:text-gray-100 text-xs'>2025 Copyright by MONATE. All rights reserved.</span>
            </div>
        </FooterContext.Provider>
    );
};

export default FooterProvider;