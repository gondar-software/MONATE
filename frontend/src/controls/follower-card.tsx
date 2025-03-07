import { LoadingSpin, StarRating } from "@app/components";
import { handleNetworkError } from "@app/handlers";
import { useJsonNoTokenOnlyRequestCryptionMiddleware } from "@app/middlewares";
import { useAlert } from "@app/providers";
import { FollowerCardProps } from "@app/types";
import { useEffect, useState } from "react";

export const FollowerCard = (props: FollowerCardProps) => {
    const { addAlert } = useAlert();
    const { jsonNoTokenOnlyRequestClient } = useJsonNoTokenOnlyRequestCryptionMiddleware();
    const [avatar, setAvatar] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(true);

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
            setLoading(false);
    }, [props.avatarPath])

    return (
        <div className="w-full p-4 flex-1">
            {loading ? 
                <div className="w-full h-32 flex justify-center items-center">
                    <LoadingSpin className='w-12 h-12' />
                </div> :
                <div className="w-full">
                    <div className="h-20 flex items-center">
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
                        <div className="h-full ml-4 flex flex-col justify-center gap-1">
                            <div className="text-gray-900 dark:text-white font-semibold">{props.email}</div>
                            <StarRating rating={props.rate} />
                        </div>
                    </div>
                    <div className="mt-8 text-gray-900 dark:text-white">
                        {props.feedback}
                    </div>
                </div>
            }
        </div>
    )
}