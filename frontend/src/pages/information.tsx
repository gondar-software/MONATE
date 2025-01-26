import { InformationCard } from "@app/components";
import { useSaveToken } from "@app/global";
import { handleNetworkError } from "@app/handlers";
import { useCryptionMiddleware } from "@app/middlewares";
import { useAlert } from "@app/providers";

export const Information = () => {
    const saveToken = useSaveToken();
    const { apiClient } = useCryptionMiddleware();
    const { addAlert } = useAlert();

    return (
        <div className='flex w-full min-h-screen justify-center items-center'>
            <InformationCard />
        </div>
    );
};

export default Information;