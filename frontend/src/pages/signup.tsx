import { useState } from "react";
import { AuthCard, CodeVerify } from "@app/components";
import { useCryptionMiddleware } from "@app/middlewares";
import { useSaveToken } from "@app/global";

export const SignUp = () => {
    const { apiClient } = useCryptionMiddleware();
    const saveToken = useSaveToken();

    const [formData, setFormData] = useState<any>();
    const [isOpen, setIsOpen] = useState(false);

    const handleSubmit = async(data: any) => {
        const response = await apiClient.post(
            '/user/register',
            {
                emailAddr: data.email,
                password: data.password,
            }
        );
        
        if (response.status === 200)
        {
            setFormData(data);
            showVerifyCode();
        }
    }

    const handleResendCode = async() => {
        const response = await apiClient.post(
            '/user/register',
            {
                emailAddr: formData.email,
                password: formData.password,
            }
        );
        
        if (response.status === 200)
        {
            setFormData(formData);
            showVerifyCode();
        }
    }

    const handleComplete = async(code: string) => {
        const response = await apiClient.post(
            '/user/verify',
            {
                emailAddr: formData.email,
                password: formData.password,
                code: code,
            }
        );

        if (response.status === 200)
        {
            saveToken(response.data.token);
            hideVerifyCode();
        }
    }

    const showVerifyCode = () => 
    {
        setIsOpen(true);
    };

    const hideVerifyCode = () => 
    {
        setIsOpen(false);
    };

    return (
        <div className='flex w-full h-screen justify-center items-center'>
            <AuthCard signUp onSubmit={handleSubmit} />
            {isOpen && <div className='absolute top-0 w-full h-full flex items-center justify-center backdrop-blur-xl bg-gray-100 bg-opacity-70 dark:bg-gray-900 dark:bg-opacity-70'>
                <div className="absolute w-full h-full flex items-center justify-center" onClick={hideVerifyCode} />
                <div className="absolute w-full max-w-sm p-4 bg-white border border-gray-200 flex flex-col justify-center rounded-lg shadow sm:p-6 md:p-8 dark:bg-gray-800 dark:border-gray-700">
                    <h5 className="text-xl font-medium text-gray-900 dark:text-white w-full text-center pb-4">
                        Input verify code
                    </h5>
                    <CodeVerify onComplete={handleComplete} />
                    <button type='button' className='text-blue-700 dark:text-blue-500 hover:underline' onClick={handleResendCode}>Resend Code</button>
                </div>
            </div>}
        </div>
    );
};

export default SignUp;