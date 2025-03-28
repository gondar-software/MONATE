import { errorTypes } from "@app/constants";
import { AlertData } from "@app/types";

export const handleNetworkError = (err: any, addAlert: ((alert: AlertData) => void) | undefined) => {
    if (err.response.status >= 500)
        addAlert?.({
            type: "danger",
            title: "Error",
            message: errorTypes[err.response.status as keyof typeof errorTypes],
        });
    else if (err.response.status >= 401) {
    }
    else
        addAlert?.({
            type: 'danger',
            title: 'Error',
            message: 'Unkown error occurred',
        });
}