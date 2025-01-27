import { AuthCard } from "@app/components";
import { useSaveToken } from "@app/global";
import { handleNetworkError } from "@app/handlers";
import { useRedirectionHelper } from "@app/helpers";
import { useJsonCryptionMiddleware } from "@app/middlewares";
import { useAlert } from "@app/providers";

export const RePassword = () => {
    const saveToken = useSaveToken();
    const redirect = useRedirectionHelper();
    const { jsonClient } = useJsonCryptionMiddleware();
    const { addAlert } = useAlert();

    const handleSubmit = (formData: any) => {
        jsonClient.post(
            '/user/re-pwd',
            {
                emailAddr: formData.email,
                password: formData.password,
            }
        ).then(res => {
            saveToken(res.data.token);
            redirect('/auth/login');
        }).catch(err => handleNetworkError(err, addAlert));
    };

    return (
        <div className='flex w-full h-screen justify-center items-center'>
            <AuthCard mode='rePwd' onSubmit={handleSubmit} />
        </div>
    );
};

export default RePassword;