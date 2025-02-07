import { fileTypes } from "@app/constants";
import { useSaveUnityBackgroundMode } from "@app/global";
import { handleNetworkError } from "@app/handlers";
import { useJsonCryptionMiddleware, useJsonOnlyRequestCryptionMiddleware } from "@app/middlewares";
import { useAlert, useHeader, useLoading } from "@app/providers";
import { useEffect } from "react";

export const Portfolios = () => {
    const { jsonClient } = useJsonCryptionMiddleware();
    const { jsonOnlyRequestClient } = useJsonOnlyRequestCryptionMiddleware();
    const { hideLoading } = useLoading();
    const { showAuthInfo } = useHeader();
    const { addAlert } = useAlert();
    const saveUnityBackgroundMode = useSaveUnityBackgroundMode();

    useEffect(() => {
        const fetchPortfolios = async () => {
            try {
                const fileTypeMap = Object.entries(fileTypes).reduce((acc: any, [key, value]) => {
                    acc[value] = key;
                    return acc;
                }, {});

                const { data } = await jsonClient.get('/portfolio');
                const portfolioIds = data.portfolioIds;

                console.log(portfolioIds);

                const portfolioResponses = await Promise.all(
                    portfolioIds.map((portfolioId: number) =>
                        jsonClient.get(`/portfolio/${portfolioId}`).catch(err => {
                            handleNetworkError(err, addAlert);
                            return null;
                        })
                    )
                );
            
                const items = portfolioResponses
                    .filter(res => res !== null)
                    .flatMap(res => res!.data.items);

                console.log(portfolioResponses);

                await Promise.all(
                    items.map(item =>
                        jsonOnlyRequestClient.get(`/download/${fileTypeMap[item.type]}?filePath=${item.path}`,
                            {
                                responseType: 'blob',
                            }
                        ).then(res => {
                            console.log(res);
                        }).catch(err => 
                            handleNetworkError(err, addAlert)
                        )
                    )
                );
            } catch (err) {
                console.log(err);
            } finally {
                saveUnityBackgroundMode('garden');
                showAuthInfo();
                hideLoading();
            }
        };

        fetchPortfolios();
    }, []);

    return <div />;
};

export default Portfolios;
