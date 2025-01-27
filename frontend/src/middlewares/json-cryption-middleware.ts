import axios from 'axios';
import { useCryptionHelper } from '@app/helpers';

export const useJsonCryptionMiddleware = () => {
    const { encrypt, decrypt } = useCryptionHelper();

    const jsonClient = axios.create({
        baseURL: `/api`,
        headers: {
            'Content-Type': 'application/json',
        },
    });

    jsonClient.interceptors.request.use(async(config) => {
        if (config.data) {
            config.data = await encrypt(JSON.stringify(config.data));
        }
        return config;
    }, (error) => {
        return Promise.reject(error);
    });

    jsonClient.interceptors.response.use(async(response) => {
        if (response.data) {
            const decrypted = await decrypt(response.data);
            response.data = decrypted && JSON.parse(decrypted);
        }
        return response;
    }, (error) => {
        return Promise.reject(error);
    });

    return { jsonClient };
};

export default useJsonCryptionMiddleware;