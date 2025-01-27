import { useState } from "react";
import { InformationCard } from "@app/components";
import { useFormCryptionMiddleware, useJsonCryptionMiddleware } from "@app/middlewares";
import { genderTypes } from "@app/constants";
import { handleNetworkError } from "@app/handlers";
import { useAlert } from "@app/providers";
import { useToken } from "@app/global";
import { useRedirectionHelper } from "@app/helpers";

export const Information = () => {
    const { jsonClient } = useJsonCryptionMiddleware();
    const { formClient } = useFormCryptionMiddleware();
    const { addAlert } = useAlert();
    const [saving, setSaving] = useState(false);
    const token = useToken();
    const redirect = useRedirectionHelper();

    const handleSubmit = (formData: any) => {
        setSaving(true);
        if (formData.avatar)
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
            }).catch(err => handleError(err));
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
                avatar: res ? res.data.filePath : null,
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
            redirect('/');
        }).catch(err => handleError(err));
    }

    const handleError = (err: any) => {
        handleNetworkError(err, addAlert);
        setSaving(false);
    }

    return (
        <div className='flex w-full min-h-screen justify-center items-center'>
            <InformationCard onSubmit={handleSubmit} saving={saving} />
        </div>
    );
};

export default Information;