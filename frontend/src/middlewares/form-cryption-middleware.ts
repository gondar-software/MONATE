import axios from 'axios';
import { useCryptionHelper } from '@app/helpers';

export const useFormCryptionMiddleware = () => {
    const { decrypt } = useCryptionHelper();

    const formClient = axios.create({
        baseURL: `/api`,
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });

    formClient.interceptors.response.use(async(response) => {
        if (response.data) {
            const decrypted = await decrypt(response.data);
            response.data = decrypted && JSON.parse(decrypted);
        }
        return response;
    }, (error) => {
        return Promise.reject(error);
    });

    return { formClient };
};

export default useFormCryptionMiddleware;