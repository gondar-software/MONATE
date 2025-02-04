import { createContext, useState, useContext, useEffect } from 'react';
import { LoadingMonate } from '@app/components';
import { useJsonCryptionMiddleware, useJsonOnlyRequestCryptionMiddleware } from '@app/middlewares';
import { useSaveUserInfo, useToken } from '@app/global';
import { userTypes } from '@app/constants';

const LoadingContext = createContext<any | undefined>(undefined);

export const LoadingProvider = (props: any) => {
    const token = useToken();
    const saveUserInfo = useSaveUserInfo();
    const { jsonClient } = useJsonCryptionMiddleware();
    const { jsonOnlyRequestClient } = useJsonOnlyRequestCryptionMiddleware();
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [userInfoLoaded, setUserInfoLoaded] = useState<boolean>(false);

    useEffect(() => {
        initLoading(token);
    }, []);

    const initLoading = async(token: any) => {
        const userMap = Object.entries(userTypes).reduce((acc: any, [key, value]) => {
            acc[value] = key;
            return acc;
        }, {});
        await jsonClient.get('user/info',
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        ).then(async(res) =>{
            if (res.data.avatar)
            {
                await jsonOnlyRequestClient.get(
                    `download/image?filePath=${res.data.avatar}`,
                    {
                        responseType: 'blob',
                        headers: {
                            Authorization: `Bearer ${token}`,
                        }
                    }
                ).then(avatar => {
                    const url = URL.createObjectURL(avatar.data);
                    saveUserInfo({
                        ...res.data,
                        avatar: url,
                        type: userMap[res.data.userType],
                    });
                }).catch().finally(() => {
                    setUserInfoLoaded(true);
                });
            }
            else
            {
                saveUserInfo({
                    ...res.data,
                    type: userMap[res.data.userType],
                });
                setUserInfoLoaded(true);
            }
        }).catch(_ => {
            saveUserInfo(null);
            setUserInfoLoaded(true);
        });
    }

    const showLoading = () => {
        setIsLoading(true);
    };

    const hideLoading = () => {
        setIsLoading(false);
    };

    return(
        <LoadingContext.Provider value={{ showLoading, hideLoading, initLoading }}>
            {props.children}
            {(!userInfoLoaded || isLoading) && <div className='fixed w-full h-full left-0 top-0'>
                <LoadingMonate className='w-full h-full' />
            </div>}
        </LoadingContext.Provider>
    );
};

export const useLoading = () => {
    return useContext(LoadingContext);
};

export default LoadingProvider;