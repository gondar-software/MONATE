import { useSaveVideoBackgroundMode } from "@app/global";
import { handleNetworkError } from "@app/handlers";
import { useRedirectionHelper } from "@app/helpers";
import { useJsonCryptionMiddleware } from "@app/middlewares";
import { useAlert, useHeader, useLoading } from "@app/providers";
import { useEffect, useState } from "react";
import { ReactFlow, Controls, Background } from '@xyflow/react';
import '@xyflow/react/dist/style.css';

export const Automation = () => {
    const [diagrams, setDiagrams] = useState<any[]>([]);
    const { showLoading, hideLoading } = useLoading();
    const { jsonClient } = useJsonCryptionMiddleware();
    const { addAlert } = useAlert();
    const { showAuthInfo } = useHeader();
    const redirect = useRedirectionHelper();
    const saveVideoBackgroundMode = useSaveVideoBackgroundMode();

    const fetchDiagrams = async () => {
        showLoading();
        await jsonClient.get(`/automation`)
            .then(res => {
                setDiagrams(res.data);
            }).catch(err => {
                handleNetworkError(err, addAlert)
                if (err.response.status === 401)
                    redirect('/auth/login');
            }
            ).finally(() => {
                saveVideoBackgroundMode(1);
                showAuthInfo();
                hideLoading();
            });
    };

    useEffect(() => {
        fetchDiagrams();
    }, []);

    return (
        <div className="w-full h-screen py-16 px-2">
            <ReactFlow proOptions={{
                hideAttribution: true,
            }}>
                <Background />
                <Controls />
            </ReactFlow>
        </div>
    )
}