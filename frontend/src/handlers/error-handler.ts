import { errorTypes } from "@app/constants";

export const handleNetworkError = (err: any, addAlert: any) => {
    if (err.response.status >= 500)
        addAlert({
            mode: "danger",
            title: "Error",
            message: errorTypes[err.response.status as keyof typeof errorTypes],
        });
    else if (err.response.status >= 401)
        addAlert({
            mode: "danger",
            title: "Error",
            message: "Your token is expired, please login again",
        });
    else
        addAlert({
            mode: 'danger',
            title: 'Error',
            message: 'Unkown error occurred',
        });
}