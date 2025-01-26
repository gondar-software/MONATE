import { errorTypes } from "@app/constants";

export const handleNetworkError = (err: any, addAlert: any) => {
    if (err.response.status >= 500)
        addAlert({
            mode: "danger",
            title: "Error",
            message: errorTypes[err.response.status as keyof typeof errorTypes],
        });
    else
        addAlert({
            mode: 'danger',
            title: 'Error',
            message: 'Unkown error occurred',
        });
}