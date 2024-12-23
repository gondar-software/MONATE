import { createContext, useState, useContext } from 'react';

import LoadingMonate from '../components/loading-monate';

const LoadingContext = createContext<any | undefined>(undefined);

const LoadingProvider = ({ children }: any) => {
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const showLoading = () => {
        setIsLoading(true);
    };

    const hideLoading = () => {
        setIsLoading(false);
    };

    return(
        <LoadingContext.Provider value={{ showLoading, hideLoading }}>
            {children}
            {isLoading && <div className='fixed w-full h-full left-0 top-0'>
                <LoadingMonate />
            </div>}
        </LoadingContext.Provider>
    );
};

export const useLoading = () => {
    return useContext(LoadingContext);
};

export default LoadingProvider;