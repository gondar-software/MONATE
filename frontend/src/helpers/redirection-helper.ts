import { useNavigate, useLocation } from "react-router-dom";
import { useLoading } from "@app/providers";

export const useRedirectionHelper = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { showLoading } = useLoading();

    const redirect = (url: string) => {
        if (location.pathname !== url) {
            showLoading?.();
            navigate(url);
        }
    };

    return redirect;
};

export default useRedirectionHelper;
