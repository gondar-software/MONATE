import { useEffect, useState } from "react";
import { AuthCard, CodeVerify } from "@app/controls";
import { useJsonCryptionMiddleware } from "@app/middlewares";
import { useSaveToken, useSaveUnityBackgroundMode } from "@app/global";
import { handleNetworkError } from "@app/handlers";
import { useAlert, useHeader, useLoading } from "@app/providers";
import { useRedirectionHelper } from "@app/helpers";

export const SignUp = () => {
    const { jsonClient } = useJsonCryptionMiddleware();
    const { addAlert } = useAlert();
    const { hideAuthInfo } = useHeader();
    const { hideLoading, initLoading } = useLoading();
    const saveToken = useSaveToken();
    const redirect = useRedirectionHelper();
    const saveUnityBackgroundMode = useSaveUnityBackgroundMode();

    const [formData, setFormData] = useState<any>();
    const [isOpen, setIsOpen] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        saveUnityBackgroundMode('garden');
        hideAuthInfo();
        hideLoading();
    }, []);

    const handleSubmit = (data: any) => {
        setSubmitting(true);
        jsonClient.post(
            '/user/register',
            {
                emailAddr: data.email,
                password: data.password,
            }
        ).then(_ => {
            setFormData(data);
            setSubmitting(false);
            showVerifyCode();
        }).catch(err => {
            handleNetworkError(err, addAlert);
            setSubmitting(false);
        });
    };

    const handleResendCode = () => {
        jsonClient.post(
            '/user/register',
            {
                emailAddr: formData.email,
                password: formData.password,
            }
        ).then(_ => {
            showVerifyCode();
        }).catch(err => {
            handleNetworkError(err, addAlert);
        });
    }

    const handleComplete = (code: string) => {
        jsonClient.post(
            '/user/verify',
            {
                emailAddr: formData.email,
                password: formData.password,
                code: code,
            }
        ).then(async(res) => {
            saveToken(res.data.token);
            await initLoading(res.data.token);
            hideVerifyCode();
            redirect('/');
        }).catch(err => {
            handleNetworkError(err, addAlert);
        });
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
        <div className='flex w-full min-h-screen justify-center items-center'>
            <AuthCard mode='signUp' submitting={submitting} onSubmit={handleSubmit} />
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