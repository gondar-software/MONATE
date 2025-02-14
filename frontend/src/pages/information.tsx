import { useEffect, useState } from "react";
import { InformationCard } from "@app/controls";
import { useFormCryptionMiddleware, useJsonCryptionMiddleware } from "@app/middlewares";
import { genderTypes, userTypes } from "@app/constants";
import { handleNetworkError } from "@app/handlers";
import { useAlert, useHeader, useLoading } from "@app/providers";
import { useSaveUserInfo, useSaveVideoBackgroundMode, useUserInfo } from "@app/global";
import { useRedirectionHelper } from "@app/helpers";

export const Information = () => {
    const { jsonClient } = useJsonCryptionMiddleware();
    const { formClient } = useFormCryptionMiddleware();
    const { addAlert } = useAlert();
    const { hideLoading } = useLoading();
    const { hideAuthInfo } = useHeader();
    const [saving, setSaving] = useState(false);
    const userInfo = useUserInfo();
    const saveUserInfo = useSaveUserInfo();
    const redirect = useRedirectionHelper();
    const saveVideoBackgroundMode = useSaveVideoBackgroundMode();

    useEffect(() => {
        saveVideoBackgroundMode(1);
        hideAuthInfo();
        hideLoading();
    }, []);

    const handleSubmit = (formData: any) => {
        setSaving(true);
        if (formData.avatar && formData.avatar !== 'original')
        {
            const formDt = new FormData();
            formDt.append('image', formData.avatar);
            formClient.post(
                '/upload/image',
                formDt
            ).then(res => {
                saveInfo(formData, res)
            }).catch(err => {
                handleNetworkError(err, addAlert)
                if (err.response.status === 401)
                    redirect('/auth/login');
            }).finally(() => {
                setSaving(false);
            });
        }
        else
        {
            saveInfo(formData)
        }
    }

    const saveInfo = (formData: any, res: any = null) => {
        const userMap = Object.entries(userTypes).reduce((acc: any, [key, value]) => {
            acc[value] = key;
            return acc;
        }, {});

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
        ).then(_ => {
            setSaving(false);
            saveUserInfo({
                ...formData,
                avatar: formData.avatar === 'original' ? (userInfo ? userInfo.avatar : '') : 
                    (formData.avatar ? URL.createObjectURL(formData.avatar) : null),
                emailAddr: userInfo ? userInfo.emailAddr : '',
                type: userInfo ? userMap[userInfo.userType] : '',
            });
            redirect('/');
        }).catch(err => {
            handleNetworkError(err, addAlert)
            if (err.response.status === 401)
                redirect('/auth/login');
        }).finally(() => {
            setSaving(false);
        });
    }

    return (
        <div className='flex w-full min-h-screen justify-center items-center'>
            <InformationCard onSubmit={handleSubmit} saving={saving} />
        </div>
    );
};

export default Information;