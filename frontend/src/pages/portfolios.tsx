import { FormHeader2 } from "@app/components";
import { PortfolioCard } from "@app/controls";
import { useSaveUnityBackgroundMode } from "@app/global";
import { handleNetworkError } from "@app/handlers";
import { useRedirectionHelper } from "@app/helpers";
import { useJsonCryptionMiddleware } from "@app/middlewares";
import { useAlert, useHeader, useLoading } from "@app/providers";
import { useEffect, useState } from "react";

export const Portfolios = () => {
    const { jsonClient } = useJsonCryptionMiddleware();
    const { hideLoading } = useLoading();
    const { showAuthInfo } = useHeader();
    const { addAlert } = useAlert();
    const saveUnityBackgroundMode = useSaveUnityBackgroundMode();
    const redirect = useRedirectionHelper();
    const [portfolioIds, setPortfolioIds] = useState<any[]>([]);

    useEffect(() => {
        const fetchPortfolios = async () => {
            await jsonClient.get('/portfolio')
                .then(res => {
                    setPortfolioIds(res.data.portfolioIds);
                }).catch(err => {
                    handleNetworkError(err, addAlert)
                    if (err.response.status === 401)
                        redirect('/auth/login');
                }
                ).finally(() => {
                    saveUnityBackgroundMode('garden');
                    showAuthInfo();
                    hideLoading();
                });
        };

        fetchPortfolios();
    }, []);

    return (
        <div className="min-h-screen w-full">
            <div className="mt-32 mb-32 pl-8 pr-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                <div className="col-span-full flex justify-center items-center pb-12">
                    <FormHeader2>
                        Portfolios
                    </FormHeader2>
                </div>
                {portfolioIds.map((id: number, index: number) => (
                    <PortfolioCard id={id} key={index} />
                ))}
            </div>
        </div>
    )
};

export default Portfolios;
