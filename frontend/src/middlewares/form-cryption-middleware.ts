import axios from 'axios';
import { useCryptionHelper } from '@app/helpers';
import { useToken } from '@app/global';

export const useFormCryptionMiddleware = () => {
    const token = useToken();
    const { decrypt } = useCryptionHelper();

    const formClient = axios.create({
        baseURL: `/api`,
        headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
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