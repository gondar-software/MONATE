import { errorTypes } from "@app/constants";
import { redirect } from "react-router-dom";

export const handleNetworkError = (err: any, addAlert: any) => {
    if (err.response.status >= 500)
        addAlert({
            mode: "danger",
            title: "Error",
            message: errorTypes[err.response.status as keyof typeof errorTypes],
        });
    else if (err.response.status == 401)
        redirect('/auth/login');
    else
        addAlert({
            mode: 'danger',
            title: 'Error',
            message: 'Unkown error occurred',
        });
}