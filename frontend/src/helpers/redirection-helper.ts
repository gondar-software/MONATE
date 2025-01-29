import { useNavigate } from "react-router-dom";
import { useLoading } from "@app/providers";

export const useRedirectionHelper = () => {
    const navigate = useNavigate();
    const { showLoading } = useLoading();

    const redirect = (url: string) => {
        showLoading();
        navigate(url);
    };

    return redirect;
};

export default useRedirectionHelper;