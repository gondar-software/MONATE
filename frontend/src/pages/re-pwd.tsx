import { AuthCard, CodeVerify } from "@app/controls";
import { useSaveVideoBackgroundMode } from "@app/global";
import { handleNetworkError } from "@app/handlers";
import { useRedirectionHelper } from "@app/helpers";
import { useJsonNoTokenCryptionMiddleware } from "@app/middlewares";
import { useAlert, useHeader, useLoading } from "@app/providers";
import { AuthCardData } from "@app/types";
import { useEffect, useState } from "react";

export const RePassword = () => {
    const redirect = useRedirectionHelper();
    const saveVideoBackgroundMode = useSaveVideoBackgroundMode();
    const { jsonNoTokenClient } = useJsonNoTokenCryptionMiddleware();
    const { addAlert } = useAlert();
    const { hideAuthInfo } = useHeader();
    const { hideLoading } = useLoading();
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [submitting, setSubmitting] = useState<boolean>(false);
    const [formData, setFormData] = useState<AuthCardData>();

    useEffect(() => {
        saveVideoBackgroundMode(1);
        hideAuthInfo?.();
        hideLoading?.();
    }, []);

    const handleSubmit = (formData: AuthCardData) => {
        setSubmitting(true);
        jsonNoTokenClient.post(
            '/user/re-pwd',
            {
                emailAddr: formData.email,
                password: formData.password,
            }
        ).then(_ => {
            setFormData(formData);
            showVerifyCode();
            addAlert?.({
                type: 'success',
                title: 'Success',
                message: 'Verify code has been sent.',
            });
        }).catch(err => {
            handleNetworkError(err, addAlert);
        }).finally(() => {
            setSubmitting(false);
        });
    };

    const handleResendCode = () => {
        jsonNoTokenClient.post(
            '/user/re-pwd',
            {
                emailAddr: formData!.email,
                password: formData!.password,
            }
        ).then(_ => {
            showVerifyCode();
            addAlert?.({
                type: 'success',
                title: 'Success',
                message: 'Verify code has been sent again.',
            });
        }).catch(err => {
            handleNetworkError(err, addAlert);
        });
    }

    const handleComplete = (code: string) => {
        jsonNoTokenClient.post(
            '/user/verify',
            {
                emailAddr: formData!.email,
                password: formData!.password,
                code: code,
            }
        ).then(_ => {
            hideVerifyCode();
            addAlert?.({
                type: 'success',
                title: 'Success',
                message: 'Password has been reset successfully. Please login.',
            });
            redirect('/auth/login');
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
        <div className='flex w-full h-screen justify-center items-center'>
            <AuthCard mode='rePwd' submitting={submitting} onSubmit={handleSubmit} />
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

export default RePassword;