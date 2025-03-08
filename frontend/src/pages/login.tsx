import { useEffect, useState } from "react";
import { AuthCard } from "@app/controls";
import { useSaveToken, useSaveVideoBackgroundMode } from "@app/global";
import { handleNetworkError } from "@app/handlers";
import { useRedirectionHelper } from "@app/helpers";
import { useAlert, useHeader, useLoading } from "@app/providers";
import { useJsonNoTokenCryptionMiddleware } from "@app/middlewares";
import { AuthCardData } from "@app/types";

export const Login = () => {
    const saveToken = useSaveToken();
    const redirect = useRedirectionHelper();
    const saveVideoBackgroundMode = useSaveVideoBackgroundMode();
    const { jsonNoTokenClient } = useJsonNoTokenCryptionMiddleware();
    const { addAlert } = useAlert();
    const { hideAuthInfo } = useHeader();
    const { hideLoading, initLoading } = useLoading();
    const [submitting, setSubmitting] = useState<boolean>(false);

    useEffect(() => {
        saveVideoBackgroundMode(1);
        hideAuthInfo?.();
        hideLoading?.();
    }, []);

    const handleSubmit = (formData: AuthCardData) => {
        setSubmitting(true);
        jsonNoTokenClient.post(
            '/user/login',
            {
                emailAddr: formData.email,
                password: formData.password,
            }
        ).then(async(res) => {
            saveToken(res.data.token);
            await initLoading?.(res.data.token);
            redirect('/');
        }).catch(err => {
            handleNetworkError(err, addAlert);
        }).finally(() => {
            setSubmitting(false);
        });
    };

    return (
        <div className='fixed py-14 flex w-full h-full'>
            <div className="w-full h-full flex justify-center items-center">
                <AuthCard submitting={submitting} mode='login' onSubmit={handleSubmit} />
            </div>
        </div>
    );
};

export default Login;