import { useEffect, useState } from "react";
import { AuthCard } from "@app/controls";
import { useSaveToken, useSaveUnityBackgroundMode } from "@app/global";
import { handleNetworkError } from "@app/handlers";
import { useRedirectionHelper } from "@app/helpers";
import { useAlert, useHeader, useLoading } from "@app/providers";
import { useJsonNoTokenCryptionMiddleware } from "@app/middlewares";

export const Login = () => {
    const saveToken = useSaveToken();
    const redirect = useRedirectionHelper();
    const saveUnityBackgroundMode = useSaveUnityBackgroundMode();
    const { jsonNoTokenClient } = useJsonNoTokenCryptionMiddleware();
    const { addAlert } = useAlert();
    const { hideAuthInfo } = useHeader();
    const { hideLoading, initLoading } = useLoading();
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        saveUnityBackgroundMode('garden');
        hideAuthInfo();
        hideLoading();
    }, []);

    const handleSubmit = (formData: any) => {
        setSubmitting(true);
        jsonNoTokenClient.post(
            '/user/login',
            {
                emailAddr: formData.email,
                password: formData.password,
            }
        ).then(async(res) => {
            saveToken(res.data.token);
            await initLoading(res.data.token);
            setSubmitting(false);
            redirect('/');
        }).catch(err => {
            handleNetworkError(err, addAlert);
            setSubmitting(false);
        });
    };

    return (
        <div className='flex w-full min-h-screen justify-center items-center'>
            <AuthCard submitting={submitting} mode='login' onSubmit={handleSubmit} />
        </div>
    );
};

export default Login;