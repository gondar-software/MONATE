import { LoadingSpin, StarRating } from "@app/components";
import { handleNetworkError } from "@app/handlers";
import { useRedirectionHelper } from "@app/helpers";
import { useJsonCryptionMiddleware, useJsonNoTokenOnlyRequestCryptionMiddleware } from "@app/middlewares";
import { useAlert } from "@app/providers";
import { FollowerCardProps } from "@app/types";
import { EyeIcon, TrashIcon } from "@heroicons/react/24/solid";
import { useEffect, useState } from "react";

export const FollowerCard = (props: FollowerCardProps) => {
    const redirect = useRedirectionHelper();
    const { addAlert } = useAlert();
    const { jsonClient } = useJsonCryptionMiddleware();
    const { jsonNoTokenOnlyRequestClient } = useJsonNoTokenOnlyRequestCryptionMiddleware();
    const [avatar, setAvatar] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(true);
    const [topRanked, setTopRanked] = useState<boolean>(props.topRanked ?? false);

    useEffect(() => {
        const fetchAvatar = async () => {
            setLoading(true);

            await jsonNoTokenOnlyRequestClient.get(`/download/image?filePath=${props.avatarPath}`, {
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
        if (props.avatarPath)
            fetchAvatar();
        else
        {
            setAvatar('');
            setLoading(false);
        }
    }, [props.avatarPath])

    const handleRank = async () => {
        setLoading(true);
        const rankData = {
            id: props.id,
            topRanked: !topRanked
        }
        await jsonClient.post('/following/rank',
            rankData
        ).then(() => {
            setTopRanked(!topRanked);
            addAlert?.({
                type: 'success',
                title: 'Success',
                message: 'Follower updated successfully.'
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
                    <div className="flex items-center flex-col sm:flex-row">
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
                        <div className="h-full ml-4 flex flex-col items-center sm:items-start justify-center gap-1">
                            <div className="text-gray-900 dark:text-white font-semibold">{props.email}</div>
                            <StarRating rating={props.rate} />
                        </div>
                        {props.user === 'admin' && <div className="flex w-full flex-row gap-3 justify-center sm:justify-end">
                            <EyeIcon
                                onClick={handleRank}
                                className={`w-5 h-5 hover:text-blue-600 ${topRanked ? 'text-blue-600' : 'text-gray-500'} transition-colors duration-200`}
                            />
                            <TrashIcon
                                onClick={async () => {
                                    try {
                                        setLoading(true);
                                        if (props.onDelete !== undefined)
                                            await props.onDelete(props.id!);
                                    }
                                    finally {
                                        setLoading(false);
                                    }
                                }}
                                className='w-5 h-5 hover:text-red-500 transition-colors duration-200'
                            />
                        </div>}
                    </div>
                    <div className="mt-8 text-gray-900 dark:text-white">
                        {props.feedback}
                    </div>
                </div>
            }
        </div>
    )
}

export default FollowerCard;