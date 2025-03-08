import axios from 'axios';
import { useCryptionHelper } from '@app/helpers';

export const useFormNoTokenCryptionMiddleware = () => {
    const { decrypt } = useCryptionHelper();

    const formNoTokenClient = axios.create({
        baseURL: `/api`,
    });

    formNoTokenClient.interceptors.response.use(async(response) => {
        if (response.data) {
            const decrypted = await decrypt(response.data);
            response.data = decrypted && JSON.parse(decrypted);
        }
        return response;
    }, (error) => {
        return Promise.reject(error);
    });

    return { formNoTokenClient };
};

export default useFormNoTokenCryptionMiddleware;