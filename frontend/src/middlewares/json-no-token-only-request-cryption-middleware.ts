import axios from 'axios';
import { useCryptionHelper } from '@app/helpers';

export const useJsonNoTokenOnlyRequestCryptionMiddleware = () => {
    const { encrypt } = useCryptionHelper();

    const jsonNoTokenOnlyRequestClient = axios.create({
        baseURL: `/api`,
        headers: {
            'Content-Type': 'application/json',
        },
    });

    jsonNoTokenOnlyRequestClient.interceptors.request.use(async(config) => {
        if (config.data) {
            config.data = await encrypt(JSON.stringify(config.data));
        }
        return config;
    }, (error) => {
        return Promise.reject(error);
    });

    return { jsonNoTokenOnlyRequestClient };
};

export default useJsonNoTokenOnlyRequestCryptionMiddleware;