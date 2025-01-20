import { useCryptionMiddleware } from "@app/middlewares";
import { useEffect } from "react";

export const Portfolios = () => {
    const { apiClient } = useCryptionMiddleware();

    useEffect(() => {
        const fetchPortfolioIds = async() => {
            const response = await apiClient.get('/portfolio');
            
            console.log(response);
        }

        fetchPortfolioIds();
    }, []);

    return (
        <div />
    );
}

export default Portfolios;