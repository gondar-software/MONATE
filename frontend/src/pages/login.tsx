import { AuthCard } from "@app/components";
import { useCryptionMiddleware } from "@app/middlewares";

export const Login = () => {
    const { apiClient } = useCryptionMiddleware();

    const handleSubmit = async(formData: any) => {
        console.log(formData);

        const response = await apiClient.post(
            '/user/login',
            {
                emailAddr: formData.email,
                password: formData.password,
            }
        );
        
        console.log(response);
    };

    return (
        <div className='flex w-full h-screen justify-center items-center'>
            <AuthCard onSubmit={handleSubmit} />
        </div>
    );
};

export default Login;