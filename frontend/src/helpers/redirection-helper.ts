import { useNavigate } from "react-router-dom";
import { useSaveUnityBackgroundMode } from "@app/global";
import { useLoading } from "@app/providers";

export const useRedirectionHelper = () => {
    const navigate = useNavigate();
    const saveUnityBackgroundMode = useSaveUnityBackgroundMode();
    const { showLoading } = useLoading();

    const redirect = (url: string) => {
        saveUnityBackgroundMode(url === '/' ? 'oasis' : 'garden');
        showLoading();
        navigate(url);
    };

    return redirect;
};

export default useRedirectionHelper;