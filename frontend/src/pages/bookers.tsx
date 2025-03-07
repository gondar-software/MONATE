import { useSaveVideoBackgroundMode, useUserInfo } from "@app/global";
import { useJsonCryptionMiddleware } from "@app/middlewares";
import { useHeader, useLoading } from "@app/providers";
import { useEffect, useState } from "react";
import { useAlert } from "../providers/alert-provider";
import { handleNetworkError } from "../handlers/error-handler";
import { Accordion, BookerCard } from "@app/controls";
import { BookerData } from "@app/types";
import { useRedirectionHelper } from "@app/helpers";

export const Bookers = () => {
    const userInfo = useUserInfo();
    const redirect = useRedirectionHelper();
    const saveVideoBackgroundMode = useSaveVideoBackgroundMode();
    const { showAuthInfo } = useHeader();
    const { hideLoading, showLoading } = useLoading();
    const { jsonClient } = useJsonCryptionMiddleware();
    const { addAlert } = useAlert();

    const [bookerData, setBookerData] = useState<BookerData[]>([]);
    const [fetchAll, setFetchAll] = useState<boolean>(false);

    const fetchFollowers = async() => {
        if (userInfo && (userInfo.type === 'admin'))
        {
            showLoading();
            setBookerData([]);
            await jsonClient.get(`/following/bookers?all=${fetchAll}`)
                .then((res) => {
                    setBookerData(res.data);
                }).catch((err) => {
                    handleNetworkError(err, addAlert);
                }).finally(() => {
                    saveVideoBackgroundMode(1);
                    showAuthInfo();
                    hideLoading();
                });
        }
        else
        {
            redirect('/');
        }
    };

    const handleDelete = async(id: number) => {
        await jsonClient.post(`/following/del-booker`,
            id
        ).then(async() => {
            await fetchFollowers();
        }).catch(err => {
            handleNetworkError(err, addAlert);
            if (err.response.status === 401)
                redirect('/auth/login');
            else if (err.response.status === 504 || err.response.status === 505)
                redirect('/');
        });
    }

    useEffect(() => {
        fetchFollowers();
    }, [fetchAll]);
    
    return (
        <div className="fixed w-full h-full py-16 flex flex-col justify-center items-center">
            <div className="relative max-w-3xl flex md:px-2 flex-col items-center min-h-full w-full">
                <div className="h-full mt-36 p-4 pt-8 w-full shadow overflow-auto rounded-b-xl bg-white dark:bg-gray-800 dark:border dark:border-t-0 dark:border-gray-400">
                    <Accordion
                        index={0}
                        items={bookerData.map((booker: BookerData) => {
                            return {
                                header: booker.name,
                                body: <BookerCard
                                        checked={booker.checked}
                                        email={booker.email}
                                        id={booker.id!}
                                        message={booker.message}
                                        onDelete={handleDelete}
                                    />
                            }
                        }) ?? []}
                    />
                </div>
                <div className="absolute w-full flex-col sm:flex-row h-40 gap-2 sm:justify-between justify-center shadow-lg flex sm:items-center items-start rounded-lg bg-white dark:bg-gray-800 dark:border dark:border-b-0 dark:border-gray-400">
                    <div className="ml-8 text-lg items-center text-gray-900 dark:text-white">
                        {`Bookers: ${bookerData.length}`}
                    </div>
                    <div className="flex gap-3 mr-8 ml-8 sm:ml-0">
                        <button
                            type='button'
                            onClick={(() => setFetchAll(!fetchAll))}
                            className='w-32 h-10 rounded-lg bg-blue-500 hover:bg-blue-600 transition-colors duration-300 text-white font-bold ml-auto'
                        >
                            {fetchAll ? 'New bookers' : 'All bookers'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Bookers;