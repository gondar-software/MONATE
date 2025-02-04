import { UploadPortfolioCard } from "@app/controls";
import { useSaveUnityBackgroundMode, useUserInfo } from "@app/global";
import { useRedirectionHelper } from "@app/helpers";
import { useHeader, useLoading } from "@app/providers";
import { useEffect } from "react";

export const UploadPortfolio = () => {
    const { hideLoading } = useLoading();
    const { showAuthInfo } = useHeader();
    const userInfo = useUserInfo();
    const redirect = useRedirectionHelper();
    const saveUnityBackgroundMode = useSaveUnityBackgroundMode();

    useEffect(() => {
        if (userInfo && (userInfo.type === 'admin' || userInfo.type === 'team'))
        {
            saveUnityBackgroundMode('garden');
            showAuthInfo();
            hideLoading();
        }
        else
        {
            redirect('/');
        }
    }, []);
    return (
        <div className='flex w-full min-h-screen justify-center items-center'>
            <UploadPortfolioCard />
        </div>
    );
};

export default UploadPortfolio;