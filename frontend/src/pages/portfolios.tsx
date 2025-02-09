import { FormHeader2, Pagenation } from "@app/components";
import { PortfolioCard } from "@app/controls";
import { useSaveUnityBackgroundMode } from "@app/global";
import { handleNetworkError } from "@app/handlers";
import { useRedirectionHelper } from "@app/helpers";
import { useJsonCryptionMiddleware } from "@app/middlewares";
import { useAlert, useHeader, useLoading } from "@app/providers";
import { useEffect, useState } from "react";

export const Portfolios = () => {
    const { jsonClient } = useJsonCryptionMiddleware();
    const { showLoading, hideLoading } = useLoading();
    const { showAuthInfo } = useHeader();
    const { addAlert } = useAlert();
    const saveUnityBackgroundMode = useSaveUnityBackgroundMode();
    const redirect = useRedirectionHelper();
    const [portfolioIds, setPortfolioIds] = useState<any[]>([]);
    const [maxPage, setMaxPage] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);

    const fetchPortfolios = async (page = 1) => {
        showLoading();
        await jsonClient.get(`/portfolio?page=${page}`)
            .then(res => {
                setPortfolioIds(res.data.portfolioIds);
                setMaxPage(res.data.maxPage);
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

    useEffect(() => {
        fetchPortfolios(currentPage);
    }, [currentPage]);

    const handleChangePage = (page: number) => {
        setCurrentPage(page);
    }

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
            <div className="fixed bottom-24 w-full flex items-center justify-center">
                <div className="backdrop-blur-xl min-w-[400px] rounded-lg p-2 flex items-center justify-center gap-2">
                    <Pagenation maxPage={maxPage} onChangePage={handleChangePage} />
                </div>
            </div>
        </div>
    )
};

export default Portfolios;
