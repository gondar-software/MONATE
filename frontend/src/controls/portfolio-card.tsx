import { LoadingSpin, SlideViewer } from "@app/components";
import { fileTypes } from "@app/constants";
import { handleNetworkError } from "@app/handlers";
import { useRedirectionHelper } from "@app/helpers";
import { useJsonCryptionMiddleware, useJsonOnlyRequestCryptionMiddleware } from "@app/middlewares";
import { useAlert } from "@app/providers";
import { useEffect, useState } from "react"

export const PortfolioCard = (props: any) => {
    const { jsonClient } = useJsonCryptionMiddleware();
    const { jsonOnlyRequestClient } = useJsonOnlyRequestCryptionMiddleware();
    const { addAlert } = useAlert();
    const [loading, setLoading] = useState(true);
    const [slides, setSlides] = useState<any[]>([]);
    const redirect = useRedirectionHelper();

    useEffect(() => {
        init(props.id);
    }, []);

    const init = async(id: number) => {
        const fileTypeMap = Object.entries(fileTypes).reduce((acc: any, [key, value]) => {
            acc[value] = key;
            return acc;
        }, {});
        
        const response = await jsonClient.get(`/portfolio/${id}`).catch(err => {
            handleNetworkError(err, addAlert)
            if (err.response.status === 401)
                redirect('/auth/login');
            return null;
        });

        const items = response?.data.items;

        const slidesData = await Promise.all(
            items?.map(async(item: any) => {
                const response = await jsonOnlyRequestClient.get(`/download/${fileTypeMap[item.type]}?filePath=${item.path}`,
                    {
                        responseType: 'blob',
                    }
                ).catch(err => {
                    handleNetworkError(err, addAlert)
                    if (err.response.status === 401)
                        redirect('/auth/login');
                    return null;
                });

                const url = URL.createObjectURL(response?.data);
                console.log(url);
                return {
                    url: url,
                    type: fileTypeMap[item.type],
                };
            })
        );

        setSlides(slidesData);
        setLoading(false);
    }

    return (
        <div className="w-full max-w-sm p-4 flex-1 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
            <form>
                {loading ? 
                    <div className="w-full h-full justify-center items-center">
                        <LoadingSpin className='w-12 h-12' />
                    </div> :
                    <div className="space-y-2">
                        <div className="w-full h-52">
                            <SlideViewer slides={slides} />
                        </div>
                    </div>
                }
            </form>
        </div>
    );
}