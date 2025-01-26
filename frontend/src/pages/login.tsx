import { AuthCard } from "@app/components";
import { useSaveToken } from "@app/global";
import { handleNetworkError } from "@app/handlers";
import { useCryptionMiddleware } from "@app/middlewares";
import { useAlert } from "@app/providers";

export const Login = () => {
    const saveToken = useSaveToken();
    const { apiClient } = useCryptionMiddleware();
    const { addAlert } = useAlert();

    const handleSubmit = (formData: any) => {
        apiClient.post(
            '/user/login',
            {
                emailAddr: formData.email,
                password: formData.password,
            }
        ).then(res => {
            saveToken(res.data.token);
        }).catch(err => handleNetworkError(err, addAlert));
    };

    return (
        <div className='flex w-full h-screen justify-center items-center'>
            <AuthCard onSubmit={handleSubmit} />
        </div>
    );
};

export default Login;