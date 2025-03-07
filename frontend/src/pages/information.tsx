import { useEffect, useState } from "react";
import { InformationCard } from "@app/controls";
import { useFormNoTokenCryptionMiddleware, useJsonCryptionMiddleware } from "@app/middlewares";
import { genderTypes } from "@app/constants";
import { handleNetworkError } from "@app/handlers";
import { useAlert, useHeader, useLoading } from "@app/providers";
import { useSaveVideoBackgroundMode } from "@app/global";
import { useRedirectionHelper } from "@app/helpers";
import { UserInfoData } from "@app/types";

export const Information = () => {
    const { jsonClient } = useJsonCryptionMiddleware();
    const { formNoTokenClient } = useFormNoTokenCryptionMiddleware();
    const { addAlert } = useAlert();
    const { hideLoading, initLoading } = useLoading();
    const { hideAuthInfo } = useHeader();
    const [saving, setSaving] = useState<boolean>(false);
    const redirect = useRedirectionHelper();
    const saveVideoBackgroundMode = useSaveVideoBackgroundMode();

    useEffect(() => {
        saveVideoBackgroundMode(1);
        hideAuthInfo();
        hideLoading();
    }, []);

    const handleSubmit = (formData: UserInfoData) => {
        setSaving(true);
        if (formData.avatar && formData.avatar !== 'original')
        {
            const formDt = new FormData();
            formDt.append('image', formData.avatar);
            formNoTokenClient.post(
                '/upload/image',
                formDt
            ).then(res => {
                saveInfo(formData, res)
            }).catch(err => {
                handleNetworkError(err, addAlert)
                if (err.response.status === 401)
                    redirect('/auth/login');
                else if (err.response.status === 504 || err.response.status === 505)
                    redirect('/');
            }).finally(() => {
                setSaving(false);
            });
        }
        else
        {
            saveInfo(formData)
        }
    }

    const saveInfo = (formData: UserInfoData, res: any = null) => {
        jsonClient.post('/user/info',
            {
                firstName: formData.firstName,
                middleName: formData.middleName,
                lastName: formData.lastName,
                gender: genderTypes[formData.gender as keyof typeof genderTypes],
                dob: formData.dob,
                address1: formData.address1,
                address2: formData.address2,
                city: formData.city,
                state: formData.state,
                zipCode: formData.zipCode,
                country: formData.country,
                avatar: res ? res.data.filePath : 'original',
                githubUrl: formData.githubUrl,
                phoneNumber: formData.phoneNumber,
            }
        ).then(async(_) => {
            setSaving(false);
            await initLoading();
            redirect('/');
        }).catch(err => {
            handleNetworkError(err, addAlert)
            if (err.response.status === 401)
                redirect('/auth/login');
            else if (err.response.status === 504 || err.response.status === 505)
                redirect('/');
        }).finally(() => {
            setSaving(false);
        });
    }

    return (
        <div className='fixed py-14 flex w-full h-full'>
            <div className="w-full h-full flex justify-center items-start overflow-auto">
                <InformationCard onSubmit={handleSubmit} saving={saving} />
            </div>
        </div>
    );
};

export default Information;