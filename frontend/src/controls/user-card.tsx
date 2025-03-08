import { FormSelect1, LoadingSpin } from "@app/components";
import { permitionTypes, userTypes } from "@app/constants";
import { handleNetworkError } from "@app/handlers";
import { useRedirectionHelper } from "@app/helpers";
import { useJsonCryptionMiddleware, useJsonNoTokenOnlyRequestCryptionMiddleware } from "@app/middlewares";
import { useAlert } from "@app/providers";
import { UserCardProps, UserPermitionType, UserType } from "@app/types";
import { TrashIcon } from "@heroicons/react/24/solid";
import { useEffect, useState } from "react";

export const UserCard = (props: UserCardProps) => {
    const redirect = useRedirectionHelper();
    const { addAlert } = useAlert();
    const { jsonClient } = useJsonCryptionMiddleware();
    const { jsonNoTokenOnlyRequestClient } = useJsonNoTokenOnlyRequestCryptionMiddleware();
    const [avatar, setAvatar] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(true);
    const [permition, setPermition] = useState<UserPermitionType>('approved');
    const [userType, setUserType] = useState<UserType>('client');

    useEffect(() => {
        const userTypeMap = Object.entries(userTypes).reduce((acc: any, [key, value]) => {
            acc[value] = key;
            return acc;
        }, {});

        setUserType(userTypeMap[props.data.type]);
    }, [props.data.type])

    useEffect(() => {
        const permitionMap = Object.entries(permitionTypes).reduce((acc: any, [key, value]) => {
            acc[value] = key;
            return acc;
        }, {});

        setPermition(permitionMap[props.data.permition]);
    }, [props.data.permition])

    useEffect(() => {
        const fetchAvatar = async () => {
            setLoading(true);

            await jsonNoTokenOnlyRequestClient.get(`/download/image?filePath=${props.data.information.avatarPath}`, {
                responseType: 'blob'
            }).then(res => {
                const url = URL.createObjectURL(res.data);
                setAvatar(url);
            }).catch(err => {
                handleNetworkError(err, addAlert);
            }).finally(() => {
                setLoading(false);
            });
        };
        if (props.data.information.avatarPath)
            fetchAvatar();
        else
        {
            setAvatar('');
            setLoading(false);
        }
    }, [props.data.information.avatarPath])

    const handleUpdate = async (userType: UserType, permition: UserPermitionType) => {
        setLoading(true);
        const updateData = {
            id: props.data.id,
            type: userTypes[userType],
            permition: permitionTypes[permition],
        }
        await jsonClient.post('/user/update',
            updateData
        ).then(() => {
            setUserType(userType);
            setPermition(permition);
            addAlert?.({
                type: 'success',
                title: 'Success',
                message: 'User info updated successfully.'
            });
        }).catch(err => {
            handleNetworkError(err, addAlert);
            if (err.response.status === 401)
                redirect('/auth/login');
            else if (err.response.status === 504 || err.response.status === 505)
                redirect('/');
        }).finally(() => {
            setLoading(false);
        });
    }

    return (
        <div className="w-full p-4 flex-1">
            {loading ?
                <div className="w-full h-32 flex justify-center items-center">
                    <LoadingSpin className='w-12 h-12' />
                </div> :
                <div className="w-full">
                    <div className="flex items-center flex-col sm:flex-row gap-3">
                        <div className="min-w-20">
                            {avatar ? (
                                <img className="w-20 h-20 rounded-full" src={avatar} alt="Avatar" />
                            ) : (
                                <div className="relative w-20 h-20 overflow-hidden flex bg-gray-100 rounded-full dark:bg-gray-600">
                                    <svg
                                        className="w-24 h-24 text-gray-400 justify-center"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                                            clipRule="evenodd"
                                        ></path>
                                    </svg>
                                </div>
                            )}
                        </div>
                        <div className="h-full ml-4 flex flex-col items-center sm:items-start justify-center">
                            <div className="text-gray-900 dark:text-white font-semibold inline">{props.data.emailAddr}</div>
                            <div className="text-gray-900 dark:text-white inline">{`${props.data.information.state}, ${props.data.information.country}`}</div>
                            <div className="text-gray-900 dark:text-white inline">{props.data.information.phoneNumber}</div>
                        </div>
                        <div className="flex w-full flex-row gap-1 justify-center sm:justify-end items-center">
                            <div className="h-8 pb-2 w-32 flex items-center justify-center">
                                <FormSelect1
                                    value={userType}
                                    onChange={(e) => {
                                        handleUpdate(e.target.value as UserType, permition);
                                    }}
                                    options={[
                                        {
                                            label: 'User',
                                            value: 'user',
                                        },
                                        {
                                            label: 'Admin',
                                            value: 'admin',
                                        },
                                        {
                                            label: 'Team Member',
                                            value: 'team'
                                        }
                                    ]}
                                />
                            </div>
                            <div className="h-8 pb-2 w-32 flex items-center justify-center">
                                <FormSelect1
                                    value={permition}
                                    onChange={(e) => {
                                        handleUpdate(userType, e.target.value as UserPermitionType);
                                    }}
                                    options={[
                                        {
                                            label: 'Pending',
                                            value: 'pending',
                                        },
                                        {
                                            label: 'Approved',
                                            value: 'approved',
                                        },
                                        {
                                            label: 'Suspended',
                                            value: 'suspended',
                                        }
                                    ]}
                                />
                            </div>
                            <TrashIcon
                                onClick={async () => {
                                    try {
                                        setLoading(true);
                                        if (props.onDelete !== undefined)
                                            await props.onDelete(props.data.id);
                                    }
                                    finally {
                                        setLoading(false);
                                    }
                                }}
                                className='w-5 h-5 hover:text-red-500 transition-colors duration-200'
                            />
                        </div>
                    </div>
                </div>
            }
        </div>
    )
}

export default UserCard;