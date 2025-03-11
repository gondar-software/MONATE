import { fileTypes } from "@app/constants";
import { portfolioTypes } from "@app/constants/portfolio-types";
import { UploadPortfolioCard } from "@app/controls";
import { useSaveVideoBackgroundMode, useUserInfo } from "@app/global";
import { handleNetworkError } from "@app/handlers";
import { useRedirectionHelper } from "@app/helpers";
import { useFormNoTokenCryptionMiddleware, useJsonCryptionMiddleware } from "@app/middlewares";
import { useAlert, useHeader, useLoading } from "@app/providers";
import { UploadPortfolioData, UploadPortfolioSlideData } from "@app/types";
import { useEffect, useState } from "react";

export const UploadPortfolio = () => {
    const { hideLoading } = useLoading();
    const { showAuthInfo } = useHeader();
    const { formNoTokenClient } = useFormNoTokenCryptionMiddleware();
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
            showAuthInfo?.();
            hideLoading?.();
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

                await formNoTokenClient.post(
                    `/upload/${slide.fileType}`,
                    formDt
                ).then(res => {
                    formData.slides[index] = { ...slide, filePath: res.data.filePath }
                }).catch(err => {
                    handleNetworkError(err, addAlert)
                    if (err.response.status === 401)
                        redirect('/auth/login');
                    else if (err.response.status === 504 || err.response.status === 505)
                        redirect('/');
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

        jsonClient.post('/portfolio/create', packet)
            .then(() => {
                addAlert?.({
                    type: 'success',
                    title: 'Success',
                    message: 'Portfolio uploaded successfully.',
                });
            }).catch(err => {
                handleNetworkError(err, addAlert)
                if (err.response.status === 401)
                    redirect('/auth/login');
                else if (err.response.status === 504 || err.response.status === 505)
                    redirect('/');
            }).finally(() => {
                setUploading(false);
            });
    }

    return (
        <div className='fixed py-14 flex w-full h-full'>
            <div className="w-full h-full flex justify-center items-start overflow-auto">
                <UploadPortfolioCard onSubmit={handleSubmit} uploading={uploading} />
            </div>
        </div>
    );
};

export default UploadPortfolio;