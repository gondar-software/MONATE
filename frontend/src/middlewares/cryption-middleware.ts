import axios from 'axios';
import { useCryptionHelper } from '@app/helpers';

export const useCryptionMiddleware = () => {
    const { encrypt, decrypt } = useCryptionHelper();

    const apiClient = axios.create({
        baseURL: `${import.meta.env.VITE_HOST_URL}/api`,
        headers: {
            'Content-Type': 'application/json',
        },
    });

    apiClient.interceptors.request.use(async(config) => {
            if (config.data) {
                config.data = await encrypt(JSON.stringify(config.data));
            }
            return config;
        }, (error) => {
            return Promise.reject(error);
        });

    apiClient.interceptors.response.use(async(response) => {
            if (response.data) {
                const decrypted = await decrypt(response.data);
                response.data = JSON.parse(decrypted);
            }
            return response;
        }, (error) => {
            return Promise.reject(error);
        });

    return { apiClient };
};

export default useCryptionMiddleware;