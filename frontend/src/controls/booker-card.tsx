import { LoadingSpin } from "@app/components";
import { handleNetworkError } from "@app/handlers";
import { useRedirectionHelper } from "@app/helpers";
import { useJsonCryptionMiddleware } from "@app/middlewares";
import { useAlert } from "@app/providers";
import { BookerCardProps } from "@app/types";
import { CheckIcon, TrashIcon } from "@heroicons/react/24/solid";
import { useState } from "react";

export const BookerCard = (props: BookerCardProps) => {
    const redirect = useRedirectionHelper();
    const { addAlert } = useAlert();
    const { jsonClient } = useJsonCryptionMiddleware();
    const [loading, setLoading] = useState<boolean>(false);
    const [checked, setChecked] = useState<boolean>(props.checked);

    const handleCheck = async () => {
        setLoading(true);
        const checkData = {
            id: props.id,
            checked: !checked
        }
        await jsonClient.post('/following/check',
            checkData
        ).then(() => {
            setChecked(!checked);
            addAlert?.({
                type: 'success',
                title: 'Success',
                message: 'Booker updated successfully.'
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
                    <div className="w-full hidden sm:flex sm:flex-col">
                        <div className="flex items-center">
                            <div className="text-gray-900 dark:text-white font-semibold">{props.email}</div>
                            <div className="flex w-full flex-row gap-3 justify-end">
                                <CheckIcon
                                    onClick={handleCheck}
                                    className={`w-5 h-5 hover:text-green-600 ${checked ? 'text-green-600' : 'text-gray-500'} transition-colors duration-200`}
                                />
                                <TrashIcon
                                    onClick={async () => {
                                        try {
                                            setLoading(true);
                                            if (props.onDelete !== undefined)
                                                await props.onDelete(props.id);
                                        }
                                        finally {
                                            setLoading(false);
                                        }
                                    }}
                                    className='w-5 h-5 hover:text-red-500 transition-colors duration-200'
                                />
                            </div>
                        </div>
                        <div className="p-2 text-gray-900 dark:text-white">
                            {props.message}
                        </div>
                    </div>
                    <div className="w-full sm:hidden">
                        <div className="flex flex-col items-start justify-start gap-2">
                            <div className="flex w-full flex-row gap-3 justify-start">
                                <CheckIcon
                                    onClick={handleCheck}
                                    className={`w-5 h-5 hover:text-green-600 ${checked ? 'text-green-600' : 'text-gray-500'} transition-colors duration-200`}
                                />
                                <TrashIcon
                                    onClick={async () => {
                                        try {
                                            setLoading(true);
                                            if (props.onDelete !== undefined)
                                                await props.onDelete(props.id);
                                        }
                                        finally {
                                            setLoading(false);
                                        }
                                    }}
                                    className='w-5 h-5 hover:text-red-500 transition-colors duration-200'
                                />
                            </div>
                            <div className="text-gray-900 dark:text-white font-semibold">{props.email}</div>
                        </div>
                        <div className="p-2 text-gray-900 dark:text-white">
                            {props.message}
                        </div>
                    </div>
                </div>
            }
        </div>
    )
}

export default BookerCard;