import { FormHeader2, Pagenation } from "@app/components";
import { PortfolioCard } from "@app/controls";
import { useSaveVideoBackgroundMode } from "@app/global";
import { handleNetworkError } from "@app/handlers";
import { useJsonNoTokenCryptionMiddleware } from "@app/middlewares";
import { useAlert, useHeader, useLoading } from "@app/providers";
import { useEffect, useState } from "react";

export const Portfolios = () => {
    const { jsonNoTokenClient } = useJsonNoTokenCryptionMiddleware();
    const { showLoading, hideLoading } = useLoading();
    const { hideAuthInfo } = useHeader();
    const { addAlert } = useAlert();
    const saveVideoBackgroundMode = useSaveVideoBackgroundMode();
    const [portfolioIds, setPortfolioIds] = useState<number[]>([]);
    const [maxPage, setMaxPage] = useState<number>(1);
    const [currentPage, setCurrentPage] = useState<number>(1);

    const fetchPortfolios = async (page = 1) => {
        showLoading?.();
        await jsonNoTokenClient.get(`/portfolio?page=${page}`)
            .then(res => {
                setPortfolioIds(res.data.portfolioIds);
                setMaxPage(res.data.maxPage);
            }).catch(err => {
                handleNetworkError(err, addAlert);
            }
            ).finally(() => {
                saveVideoBackgroundMode(1);
                hideAuthInfo?.();
                hideLoading?.();
            });
    };

    useEffect(() => {
        fetchPortfolios(currentPage);
    }, [currentPage]);

    const handleChangePage = (page: number) => {
        setCurrentPage(page);
    }

    return (
        <div className='fixed py-14 flex w-full h-full'>
            <div className="w-full h-full flex justify-center items-start overflow-auto">
                <div className="my-12 px-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
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
        </div>
    )
};

export default Portfolios;
