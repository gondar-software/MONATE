import { errorTypes } from "@app/constants";

export const handleNetworkError = (err: any, addAlert: any) => {
    if (err.response.status >= 500)
        addAlert({
            type: "danger",
            title: "Error",
            message: errorTypes[err.response.status as keyof typeof errorTypes],
        });
    else if (err.response.status >= 401)
        addAlert({
            type: "danger",
            title: "Error",
            message: "Your token is expired, please login again",
        });
    else
        addAlert({
            type: 'danger',
            title: 'Error',
            message: 'Unkown error occurred',
        });
}