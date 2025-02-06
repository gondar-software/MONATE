import { fileTypes } from "@app/constants";
import { portfolioTypes } from "@app/constants/portfolio-types";
import { UploadPortfolioCard } from "@app/controls";
import { useSaveUnityBackgroundMode, useToken, useUserInfo } from "@app/global";
import { handleNetworkError } from "@app/handlers";
import { useRedirectionHelper } from "@app/helpers";
import { useFormCryptionMiddleware, useJsonCryptionMiddleware } from "@app/middlewares";
import { useAlert, useHeader, useLoading } from "@app/providers";
import { useEffect, useState } from "react";

export const UploadPortfolio = () => {
    const { hideLoading } = useLoading();
    const { showAuthInfo } = useHeader();
    const { formClient } = useFormCryptionMiddleware();
    const { jsonClient } = useJsonCryptionMiddleware();
    const { addAlert } = useAlert();
    const userInfo = useUserInfo();
    const token = useToken();
    const redirect = useRedirectionHelper();
    const saveUnityBackgroundMode = useSaveUnityBackgroundMode();

    const [uploading, setUploading] = useState(false);

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
    }, [userInfo]);

    const handleSubmit = async(formData: any) => {
        setUploading(true);
    
        await Promise.all(
            formData.slides.map(async (slide: any, index: number) => {
                console.log(slide);
                const formDt = new FormData();
                formDt.append(slide.fileType, slide.file);

                await formClient.post(
                    `/upload/${slide.fileType}`,
                    formDt,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                ).then(res => {
                    formData.slides[index] = { ...slide, filePath: res.data.filePath }
                }).catch(err => {
                    handleNetworkError(err, addAlert);
                });
            })
        );

        const items = formData.slides.map((slide: any) => ({
            type: fileTypes[slide.fileType as keyof typeof fileTypes],
            path: slide.filePath,
        }));
        const packet = {
            type: portfolioTypes[formData.type as keyof typeof portfolioTypes],
            name: formData.title,
            url: formData.url,
            categories: formData.categories,
            items: items,
        }

        jsonClient.post('/portfolio/create',
            packet,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        ).then()
        .catch(err => handleNetworkError(err, addAlert))
        .finally(() => {
            setUploading(false);
        });
    }

    return (
        <div className='flex w-full min-h-screen justify-center items-center'>
            <UploadPortfolioCard onSubmit={handleSubmit} uploading={uploading} />
        </div>
    );
};

export default UploadPortfolio;