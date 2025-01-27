import { AuthCard } from "@app/components";
import { useSaveToken } from "@app/global";
import { handleNetworkError } from "@app/handlers";
import { useRedirectionHelper } from "@app/helpers";
import { useJsonCryptionMiddleware } from "@app/middlewares";
import { useAlert } from "@app/providers";

export const Login = () => {
    const saveToken = useSaveToken();
    const redirect = useRedirectionHelper();
    const { jsonClient } = useJsonCryptionMiddleware();
    const { addAlert } = useAlert();

    const handleSubmit = (formData: any) => {
        jsonClient.post(
            '/user/login',
            {
                emailAddr: formData.email,
                password: formData.password,
            }
        ).then(res => {
            saveToken(res.data.token);
            redirect('/');
        }).catch(err => handleNetworkError(err, addAlert));
    };

    return (
        <div className='flex w-full h-screen justify-center items-center'>
            <AuthCard mode='login' onSubmit={handleSubmit} />
        </div>
    );
};

export default Login;