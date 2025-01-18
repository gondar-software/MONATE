import { Card } from '@app/components';
import { useEffect } from 'react';

export const Portfolio = (props: any) => {
    useEffect(() => {
        const getPortfolioData = async() => {
            const url = `/api/portfolio?id=${props.id}`;
            const response = await fetch(url, {
                method: 'GET',
            });
            console.log(response);
        }
        getPortfolioData();
    }, []);

    return (
        <Card>
        </Card>
    )
}