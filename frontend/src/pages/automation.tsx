import { useSaveVideoBackgroundMode } from "@app/global";
import { handleNetworkError } from "@app/handlers";
import { useRedirectionHelper } from "@app/helpers";
import { useJsonCryptionMiddleware } from "@app/middlewares";
import { useAlert, useHeader, useLoading } from "@app/providers";
import { useCallback, useEffect, useState } from "react";
import { ReactFlow, Controls, Background, applyNodeChanges, applyEdgeChanges, addEdge } from '@xyflow/react';
import { customNodeTypes } from "@app/n8n";
import '@xyflow/react/dist/style.css';

export const Automation = () => {
    const [diagrams, setDiagrams] = useState<any[]>([]);
    const [nodes, setNodes] = useState<any[]>([
        {
            id: 'node-1',
            type: 'triggerManually',
            position: { x: 0, y: 0 },
        }
    ]);
    const [edges, setEdges] = useState<any[]>([]);
    const { showLoading, hideLoading } = useLoading();
    const { jsonClient } = useJsonCryptionMiddleware();
    const { addAlert } = useAlert();
    const { showAuthInfo } = useHeader();
    const redirect = useRedirectionHelper();
    const saveVideoBackgroundMode = useSaveVideoBackgroundMode();

    const onNodesChange = useCallback((changes: any) => {
        setNodes((nds) => applyNodeChanges(changes, nds));
    }, [setNodes]);
    const onEdgesChange = useCallback((changes: any) => {
        setEdges((eds) => applyEdgeChanges(changes, eds));
    }, [setEdges]);
    const onConnect = useCallback((params: any) => {
        setEdges((eds) => addEdge(params, eds));
    }, [setEdges]);

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
            <ReactFlow 
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                nodeTypes={customNodeTypes}
                proOptions={{
                    hideAttribution: true,
                }}>
                <Background />
                <Controls />
            </ReactFlow>
        </div>
    )
}