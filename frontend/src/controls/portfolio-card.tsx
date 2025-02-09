import { Badge, FormHeader3, FormLinkButton1, LoadingSpin, SlideViewer } from "@app/components";
import { fileTypes, portfolioTypes } from "@app/constants";
import { handleNetworkError } from "@app/handlers";
import { useRedirectionHelper } from "@app/helpers";
import { useJsonCryptionMiddleware, useJsonOnlyRequestCryptionMiddleware } from "@app/middlewares";
import { useAlert } from "@app/providers";
import { LinkIcon } from "@heroicons/react/24/solid";
import { useEffect, useState } from "react"
import { BadgePicker } from "@app/controls";

const portfolioBadgeModes = {
    0: 'blue',
    1: 'red',
    2: 'green',
    3: 'yellow',
};

export const PortfolioCard = (props: any) => {
    const { jsonClient } = useJsonCryptionMiddleware();
    const { jsonOnlyRequestClient } = useJsonOnlyRequestCryptionMiddleware();
    const { addAlert } = useAlert();
    const [loading, setLoading] = useState(true);
    const [slides, setSlides] = useState<any[]>([]);
    const [portfolioType, setPortfolioType] = useState('');
    const [portfolioColorMode, setPortfolioColorMode] = useState('');
    const [portfolioName, setPortfolioName] = useState('');
    const [portfolioUrl, setPortfolioUrl] = useState('');
    const [categories, setCategories] = useState<any[]>([]);
    const redirect = useRedirectionHelper();

    useEffect(() => {
        init(props.id);
    }, []);

    const init = async(id: number) => {
        const fileTypeMap = Object.entries(fileTypes).reduce((acc: any, [key, value]) => {
            acc[value] = key;
            return acc;
        }, {});
        const portfolioTypeMap = Object.entries(portfolioTypes).reduce((acc: any, [key, value]) => {
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

        setPortfolioType((portfolioTypeMap[response?.data.type] as string).toUpperCase());
        setPortfolioColorMode(portfolioBadgeModes[response?.data.type as keyof typeof portfolioBadgeModes]);
        setPortfolioName(response?.data.name);
        setPortfolioUrl(response?.data.url);
        setCategories(response?.data.categories);

        setSlides(slidesData);
        setLoading(false);
    }

    return (
        <div className="w-full max-w-sm p-4 h-90 flex-1 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
            <form className="w-full h-full">
                {loading ? 
                    <div className="w-full h-full flex justify-center items-center">
                        <LoadingSpin className='w-12 h-12' />
                    </div> :
                    <div className="space-y-2">
                        <div className="flex">
                            <Badge 
                                mode={portfolioColorMode} 
                                name={portfolioType}
                                hiddenRemoveButton
                            />
                        </div>
                        <div className="w-full h-52">
                            <SlideViewer slides={slides} />
                        </div>
                        <FormHeader3>
                            {portfolioName}
                        </FormHeader3>
                        <FormLinkButton1
                            url={portfolioUrl}
                            icon={<LinkIcon className="h-4" />}
                        >
                            {portfolioUrl}
                        </FormLinkButton1>
                        <BadgePicker selectedBadges={categories} disabled />
                    </div>
                }
            </form>
        </div>
    );
}