import { useEffect, useState } from "react";
import { AuthCard } from "@app/controls";
import { useSaveToken, useSaveVideoBackgroundMode } from "@app/global";
import { handleNetworkError } from "@app/handlers";
import { useRedirectionHelper } from "@app/helpers";
import { useAlert, useHeader, useLoading } from "@app/providers";
import { useJsonNoTokenCryptionMiddleware } from "@app/middlewares";

export const Login = () => {
    const saveToken = useSaveToken();
    const redirect = useRedirectionHelper();
    const saveVideoBackgroundMode = useSaveVideoBackgroundMode();
    const { jsonNoTokenClient } = useJsonNoTokenCryptionMiddleware();
    const { addAlert } = useAlert();
    const { hideAuthInfo } = useHeader();
    const { hideLoading, initLoading } = useLoading();
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        saveVideoBackgroundMode(1);
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
            redirect('/');
        }).catch(err => {
            if (err.response.status === 513)
                redirect('/user/info');
            handleNetworkError(err, addAlert);
        }).finally(() => {
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