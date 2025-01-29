import { useEffect, useState } from "react";
import { InformationCard } from "@app/components";
import { useFormCryptionMiddleware, useJsonCryptionMiddleware } from "@app/middlewares";
import { genderTypes } from "@app/constants";
import { handleNetworkError } from "@app/handlers";
import { useAlert, useHeader, useLoading } from "@app/providers";
import { useSaveUnityBackgroundMode, useSaveUserInfo, useToken, useUserInfo } from "@app/global";
import { useRedirectionHelper } from "@app/helpers";

export const Information = () => {
    const { jsonClient } = useJsonCryptionMiddleware();
    const { formClient } = useFormCryptionMiddleware();
    const { addAlert } = useAlert();
    const { hideLoading } = useLoading();
    const { hideAuthInfo } = useHeader();
    const [saving, setSaving] = useState(false);
    const token = useToken();
    const userInfo = useUserInfo();
    const saveUserInfo = useSaveUserInfo();
    const redirect = useRedirectionHelper();
    const saveUnityBackgroundMode = useSaveUnityBackgroundMode();

    useEffect(() => {
        jsonClient.get('user/info',
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        ).then(_ => initialSuccess()
        ).catch(err => {
            if (err.response.status === 513)
                initialSuccess();
            else
                redirect('/auth/login');
        });
    }, []);

    const initialSuccess = () => {
        saveUnityBackgroundMode('garden');
        hideAuthInfo();
        hideLoading();
    }

    const handleSubmit = (formData: any) => {
        setSaving(true);
        if (formData.avatar && formData.avatar !== 'original')
        {
            const formDt = new FormData();
            formDt.append('image', formData.avatar);
            formClient.post(
                '/upload/image',
                formDt,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            ).then(res => {
                saveInfo(formData, res)
            }).catch(err => 
                handleNetworkError(err, addAlert)
            ).finally(() => {
                setSaving(false);
            });
        }
        else
        {
            saveInfo(formData)
        }
    }

    const saveInfo = (formData: any, res: any = null) => {
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
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            },
        ).then(_ => {
            setSaving(false);
            saveUserInfo({
                ...formData,
                avatar: formData.avatar === 'original' ? (userInfo ? userInfo.avatar : '') : 
                    (formData.avatar ? URL.createObjectURL(formData.avatar) : null),
                emailAddr: userInfo ? userInfo.emailAddr : '',
            });
            redirect('/');
        }).catch(err => 
            handleNetworkError(err, addAlert)
        ).finally(() => {
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