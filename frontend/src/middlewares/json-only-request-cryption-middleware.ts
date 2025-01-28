import axios from 'axios';
import { useCryptionHelper } from '@app/helpers';

export const useJsonOnlyRequestCryptionMiddleware = () => {
    const { encrypt } = useCryptionHelper();

    const jsonOnlyRequestClient = axios.create({
        baseURL: `/api`,
        headers: {
            'Content-Type': 'application/json',
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