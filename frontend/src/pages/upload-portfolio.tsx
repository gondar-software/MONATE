import { fileTypes } from "@app/constants";
import { portfolioTypes } from "@app/constants/portfolio-types";
import { UploadPortfolioCard } from "@app/controls";
import { useSaveVideoBackgroundMode, useUserInfo } from "@app/global";
import { handleNetworkError } from "@app/handlers";
import { useRedirectionHelper } from "@app/helpers";
import { useFormCryptionMiddleware, useJsonCryptionMiddleware } from "@app/middlewares";
import { useAlert, useHeader, useLoading } from "@app/providers";
import { UploadPortfolioData, UploadPortfolioSlideData } from "@app/types";
import { useEffect, useState } from "react";

export const UploadPortfolio = () => {
    const { hideLoading } = useLoading();
    const { showAuthInfo } = useHeader();
    const { formClient } = useFormCryptionMiddleware();
    const { jsonClient } = useJsonCryptionMiddleware();
    const { addAlert } = useAlert();
    const userInfo = useUserInfo();
    const redirect = useRedirectionHelper();
    const saveVideoBackgroundMode = useSaveVideoBackgroundMode();

    const [uploading, setUploading] = useState<boolean>(false);

    useEffect(() => {
        if (userInfo && (userInfo.type === 'admin' || userInfo.type === 'team'))
        {
            saveVideoBackgroundMode(1);
            showAuthInfo();
            hideLoading();
        }
        else
        {
            redirect('/');
        }
    }, [userInfo]);

    const handleSubmit = async(formData: UploadPortfolioData) => {
        setUploading(true);
    
        await Promise.all(
            formData.slides.map(async (slide: UploadPortfolioSlideData, index: number) => {
                console.log(slide);
                const formDt = new FormData();
                formDt.append(slide.fileType, slide.file!);

                await formClient.post(
                    `/upload/${slide.fileType}`,
                    formDt
                ).then(res => {
                    formData.slides[index] = { ...slide, filePath: res.data.filePath }
                }).catch(err => {
                    handleNetworkError(err, addAlert)
                    if (err.response.status === 401)
                        redirect('/auth/login');
                });
            })
        );

        const items = formData.slides.map((slide: UploadPortfolioSlideData) => ({
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

        jsonClient.post('/portfolio/create', packet).then()
            .catch(err => {
                handleNetworkError(err, addAlert)
                if (err.response.status === 401)
                    redirect('/auth/login');
            })
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