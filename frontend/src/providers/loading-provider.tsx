import { createContext, useState, useContext, useEffect } from 'react';
import { LoadingMonate } from '@app/components';
import { useJsonNoTokenCryptionMiddleware, useJsonNoTokenOnlyRequestCryptionMiddleware } from '@app/middlewares';
import { useSaveUserInfo, useToken, useVideo1Loaded, useVideo2Loaded } from '@app/global';
import { userTypes } from '@app/constants';
import { useNavigate } from 'react-router-dom';
import { LoadingProviderProps } from '@app/types';

const LoadingContext = createContext<{
    showLoading?: () => void;
    hideLoading?: () => void;
    initLoading?: (tokenData?: string) => Promise<void>;
}>({});

export const LoadingProvider = (props: LoadingProviderProps) => {
    const saveUserInfo = useSaveUserInfo();
    const navigate = useNavigate();
    const token = useToken();
    const video1Loaded = useVideo1Loaded();
    const video2Loaded = useVideo2Loaded();
    const { jsonNoTokenOnlyRequestClient } = useJsonNoTokenOnlyRequestCryptionMiddleware();
    const { jsonNoTokenClient } = useJsonNoTokenCryptionMiddleware();
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [userInfoLoaded, setUserInfoLoaded] = useState<boolean>(false);

    useEffect(() => {
        initLoading();
    }, []);

    const initLoading = async(tokenData: string = token) => {
        const userMap = Object.entries(userTypes).reduce((acc: any, [key, value]) => {
            acc[value] = key;
            return acc;
        }, {});
        await jsonNoTokenClient.get('/user/info',
            {
                headers: {
                    Authorization: `Bearer ${tokenData}`
                }
            }
        ).then(async(res) =>{
            if (res.data.avatar)
            {
                await jsonNoTokenOnlyRequestClient.get(
                    `/download/image?filePath=${res.data.avatar}`,
                    {
                        responseType: 'blob'
                    }
                ).then(avatar => {
                    const url = URL.createObjectURL(avatar.data);
                    saveUserInfo({
                        ...res.data,
                        avatar: url,
                        type: userMap[res.data.userType],
                    });
                }).catch(_ => {}).finally(() => {
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
        }).catch(err => {
            setUserInfoLoaded(true);
            if (err.response.status === 513)
                navigate('/user/info');
            else
            {
                saveUserInfo(undefined);
            }
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
            {(!userInfoLoaded || isLoading) && (video1Loaded && video2Loaded) && <div className='fixed w-full h-full left-0 top-0'>
                <LoadingMonate className='w-full h-full' />
            </div>}
        </LoadingContext.Provider>
    );
};

export const useLoading = () => {
    return useContext(LoadingContext);
};

export default LoadingProvider;