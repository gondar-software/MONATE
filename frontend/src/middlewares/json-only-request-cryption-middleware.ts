import axios from 'axios';
import { useCryptionHelper } from '@app/helpers';
import { useToken } from '@app/global';

export const useJsonOnlyRequestCryptionMiddleware = () => {
    const { encrypt } = useCryptionHelper();
    const token = useToken();

    const jsonOnlyRequestClient = axios.create({
        baseURL: `/api`,
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
    });

    jsonOnlyRequestClient.interceptors.request.use(async(config) => {
        if (config.data) {
            config.data = await encrypt(JSON.stringify(config.data));
        }
        return config;
    }, (error) => {
        return Promise.reject(error);
    });

    return { jsonOnlyRequestClient };
};

export default useJsonOnlyRequestCryptionMiddleware;