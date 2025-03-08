import { useEffect, useState } from "react";
import { SettingsCard } from "@app/controls";
import { useSaveVideoBackgroundMode, useUserInfo } from "@app/global";
import { handleNetworkError } from "@app/handlers";
import { useRedirectionHelper } from "@app/helpers";
import { useAlert, useHeader, useLoading } from "@app/providers";
import { useJsonCryptionMiddleware } from "@app/middlewares";
import { SettingsData } from "@app/types";

export const Settings = () => {
    const userInfo = useUserInfo();
    const redirect = useRedirectionHelper();
    const saveVideoBackgroundMode = useSaveVideoBackgroundMode();
    const { jsonClient } = useJsonCryptionMiddleware();
    const { addAlert } = useAlert();
    const { showAuthInfo } = useHeader();
    const { showLoading, hideLoading } = useLoading();
    const [updating, setUpdating] = useState<boolean>(false);
    const [settings, setSettings] = useState<SettingsData | undefined>();

    const fetchSettings = async() => {
        if (userInfo && (userInfo.type === 'admin'))
        {
            showLoading?.();
            setSettings(undefined);
            await jsonClient.get("/system")
                .then((res) => {
                    setSettings(res.data);
                }).catch((err) => {
                    handleNetworkError(err, addAlert);
                    if (err.response.status === 401)
                        redirect('/auth/login');
                    else if (err.response.status === 504 || err.response.status === 505)
                        redirect('/');
                }).finally(() => {
                    saveVideoBackgroundMode(1);
                    showAuthInfo?.();
                    hideLoading?.();
                });
        }
        else
        {
            redirect('/');
        }
    };

    useEffect(() => {
        fetchSettings();
    }, []);

    const handleUpdate = async(settingsData: SettingsData) => {
        setUpdating(true);
        jsonClient.post(
            '/system',
            settingsData
        ).then(() => {
            addAlert?.({
                type: 'success',
                title: 'Success',
                message: 'Saved successfully.',
            });
        }).catch(err => {
            handleNetworkError(err, addAlert);
            if (err.response.status === 401)
                redirect('/auth/login');
            else if (err.response.status === 504 || err.response.status === 505)
                redirect('/');
        }).finally(() => {
            setUpdating(false);
        });
    };

    const handleCancel = () => {
        redirect('/');
    };

    return (
        <div className='fixed py-14 flex w-full h-full'>
            <div className="w-full h-full flex justify-center items-center">
                <SettingsCard 
                    data={settings}
                    updating={updating}
                    onUpdate={handleUpdate}
                    onCancel={handleCancel}
                />
            </div>
        </div>
    );
};

export default Settings;