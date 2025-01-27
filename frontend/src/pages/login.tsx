import { useEffect, useState } from "react";
import { AuthCard } from "@app/components";
import { useSaveToken, useSaveUnityBackgroundMode } from "@app/global";
import { handleNetworkError } from "@app/handlers";
import { useRedirectionHelper } from "@app/helpers";
import { useJsonCryptionMiddleware } from "@app/middlewares";
import { useAlert, useHeader, useLoading } from "@app/providers";

export const Login = () => {
    const saveToken = useSaveToken();
    const redirect = useRedirectionHelper();
    const saveUnityBackgroundMode = useSaveUnityBackgroundMode();
    const { jsonClient } = useJsonCryptionMiddleware();
    const { addAlert } = useAlert();
    const { hideAuthInfo } = useHeader();
    const { hideLoading } = useLoading();
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        saveUnityBackgroundMode('garden');
        hideAuthInfo();
        hideLoading();
    }, []);

    const handleSubmit = (formData: any) => {
        setSubmitting(true);
        jsonClient.post(
            '/user/login',
            {
                emailAddr: formData.email,
                password: formData.password,
            }
        ).then(res => {
            saveToken(res.data.token);
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