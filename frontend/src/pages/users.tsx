import { useSaveVideoBackgroundMode, useUserInfo } from "@app/global";
import { useJsonCryptionMiddleware } from "@app/middlewares";
import { useHeader, useLoading } from "@app/providers";
import { useEffect, useState } from "react";
import { useAlert } from "../providers/alert-provider";
import { handleNetworkError } from "../handlers/error-handler";
import { Accordion, UserCard } from "@app/controls";
import { UserManagingData } from "@app/types";
import { useRedirectionHelper } from "@app/helpers";

export const Users = () => {
    const userInfo = useUserInfo();
    const redirect = useRedirectionHelper();
    const saveVideoBackgroundMode = useSaveVideoBackgroundMode();
    const { showAuthInfo } = useHeader();
    const { hideLoading, showLoading } = useLoading();
    const { jsonClient } = useJsonCryptionMiddleware();
    const { addAlert } = useAlert();

    const [userData, setUserData] = useState<UserManagingData[]>([]);

    const fetchUsers = async() => {
        if (userInfo && (userInfo.type === 'admin'))
        {
            showLoading?.();
            setUserData([]);
            await jsonClient.get(`/user`)
                .then((res) => {
                    setUserData(res.data);
                }).catch((err) => {
                    handleNetworkError(err, addAlert);
                }).finally(() => {
                    saveVideoBackgroundMode(1);
                    showAuthInfo?.();
                    hideLoading?.();
                });
        }
        else
        {
            redirect('/');
        }
    };

    const handleDelete = async(id: number) => {
        await jsonClient.post(`/user/delete`,
            id
        ).then(async() => {
            await fetchUsers();
        }).catch(err => {
            handleNetworkError(err, addAlert);
            if (err.response.status === 401)
                redirect('/auth/login');
            else if (err.response.status === 504 || err.response.status === 505)
                redirect('/');
        });
    }

    useEffect(() => {
        fetchUsers();
    }, []);
    
    return (
        <div className="fixed w-full h-full py-16 flex flex-col justify-center items-center">
            <div className="relative max-w-3xl flex md:px-2 flex-col items-center min-h-full w-full">
                <div className="h-full mt-36 p-4 pt-8 w-full shadow overflow-auto rounded-b-xl bg-white dark:bg-gray-800 dark:border dark:border-t-0 dark:border-gray-400">
                    <Accordion
                        index={0}
                        items={userData.map((user: UserManagingData) => {
                            return {
                                header: `${user.information.firstName} ${user.information.lastName}`,
                                body: <UserCard
                                        data={user}
                                        onDelete={handleDelete}
                                    />
                            }
                        }) ?? []}
                    />
                </div>
                <div className="absolute w-full flex-col sm:flex-row h-40 gap-2 sm:justify-between justify-center shadow-lg flex sm:items-center items-start rounded-lg bg-white dark:bg-gray-800 dark:border dark:border-b-0 dark:border-gray-400">
                    <div className="ml-8 text-lg items-center text-gray-900 dark:text-white">
                        {`Users: ${userData.length}`}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Users;