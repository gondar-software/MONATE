import { useNavigate } from "react-router-dom";
import { useSaveUnityBackgroundMode } from "@app/global";

export const useRedirectionHelper = () => {
    const navigate = useNavigate();
    const saveUnityBackgroundMode = useSaveUnityBackgroundMode();

    const redirect = (url: string) => {
        saveUnityBackgroundMode(url === '/' ? 'oasis' : 'garden');
        navigate(url);
    };

    return redirect;
};

export default useRedirectionHelper;