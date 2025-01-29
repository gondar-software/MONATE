import { useSaveUnityBackgroundMode } from "@app/global";
import { useJsonCryptionMiddleware } from "@app/middlewares";
import { useHeader, useLoading } from "@app/providers";
import { useEffect } from "react";

export const Portfolios = () => {
    const { jsonClient } = useJsonCryptionMiddleware();
    const { hideLoading } = useLoading();
    const { showAuthInfo } = useHeader();
    const saveUnityBackgroundMode = useSaveUnityBackgroundMode();

    useEffect(() => {
        jsonClient.get(
            '/portfolio'
        ).then(
        ).catch(
        ).finally(() => {
            saveUnityBackgroundMode('garden');
            showAuthInfo();
            hideLoading();
        });
    }, []);

    return (
        <div />
    );
}

export default Portfolios;