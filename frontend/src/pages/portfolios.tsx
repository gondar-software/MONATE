import { useJsonCryptionMiddleware } from "@app/middlewares";
import { useEffect } from "react";

export const Portfolios = () => {
    const { jsonClient } = useJsonCryptionMiddleware();

    useEffect(() => {
        const fetchPortfolioIds = async() => {
            const response = await jsonClient.get('/portfolio');
            
            console.log(response);
        }

        fetchPortfolioIds();
    }, []);

    return (
        <div />
    );
}

export default Portfolios;