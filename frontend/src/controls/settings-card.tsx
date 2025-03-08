import { FormCancelButton1, FormHeader1, FormSubmitButton1, FormTextField1 } from '@app/components';
import { SettingsCardProps } from '@app/types';
import { useEffect, useState } from 'react';

export const SettingsCard = (props: SettingsCardProps) => {
    const [openAIApiKey, setOpenAIApiKey] = useState<string>('');
    const [googleApiKey, setGoogleApiKey] = useState<string>('');
    const [googleCseId, setGoogleCseId] = useState<string>('');
    const [qwenUrl, setQwenUrl] = useState<string>('');
    const [comfyUIServerUrl, setComfyUIServerUrl] = useState<string>('');
    const [comfyUIWSUrl, setComfyUIWSUrl] = useState<string>('');

    const handleSubmit = async(event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        await props.onUpdate?.({
            openAIApiKey,
            googleApiKey,
            googleCseId,
            qwenUrl,
            comfyUIServerUrl,
            comfyUIWSUrl,
        });
    };

    useEffect(() => {
        setOpenAIApiKey(props.data?.openAIApiKey ?? '');
        setGoogleApiKey(props.data?.googleApiKey ?? '');
        setGoogleCseId(props.data?.googleCseId ?? '');
        setQwenUrl(props.data?.qwenUrl ?? '');
        setComfyUIServerUrl(props.data?.comfyUIServerUrl ?? '');
        setComfyUIWSUrl(props.data?.comfyUIWSUrl ?? '');
    }, [props.data]);

    return (
        <div className="w-full max-w-sm p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-6 md:p-8 dark:bg-gray-800 dark:border-gray-700">
            <form className="space-y-6" onSubmit={handleSubmit}>
                <FormHeader1>
                    Settings
                </FormHeader1>
                <FormTextField1 
                    label="OPENAI_API_KEY" 
                    type="OPENAI_API_KEY" 
                    name="OPENAI_API_KEY" 
                    id="OPENAI_API_KEY" 
                    placeholder="sk-proj-013..."
                    value={openAIApiKey ?? ''} 
                    onChange={(e) => setOpenAIApiKey(e.target.value)} 
                    required
                />
                <FormTextField1 
                    label="GOOGLE_API_KEY" 
                    type="GOOGLE_API_KEY" 
                    name="GOOGLE_API_KEY" 
                    id="GOOGLE_API_KEY" 
                    placeholder="AIzaSyD..."
                    value={googleApiKey ?? ''} 
                    onChange={(e) => setGoogleApiKey(e.target.value)} 
                    required
                />
                <FormTextField1 
                    label="GOOGLE_CSE_ID" 
                    type="GOOGLE_CSE_ID" 
                    name="GOOGLE_CSE_ID" 
                    id="GOOGLE_CSE_ID" 
                    placeholder="43db1..."
                    value={googleCseId ?? ''} 
                    onChange={(e) => setGoogleCseId(e.target.value)} 
                    required
                />
                <FormTextField1 
                    label="QWEN_URL" 
                    type="QWEN_URL" 
                    name="QWEN_URL" 
                    id="QWEN_URL" 
                    placeholder="https://..."
                    value={qwenUrl ?? ''} 
                    onChange={(e) => setQwenUrl(e.target.value)} 
                    required
                />
                <FormTextField1 
                    label="COMFYUI_SERVER_URL" 
                    type="COMFYUI_SERVER_URL" 
                    name="COMFYUI_SERVER_URL" 
                    id="COMFYUI_SERVER_URL" 
                    placeholder="https://..."
                    value={comfyUIServerUrl ?? ''} 
                    onChange={(e) => setComfyUIServerUrl(e.target.value)} 
                    required
                />
                <FormTextField1 
                    label="COMFYUI_WS_URL" 
                    type="COMFYUI_WS_URL" 
                    name="COMFYUI_WS_URL" 
                    id="COMFYUI_WS_URL" 
                    placeholder="wss://..."
                    value={comfyUIWSUrl ?? ''} 
                    onChange={(e) => setComfyUIWSUrl(e.target.value)} 
                    required
                />
                <div className='w-full flex flex-row gap-2'>
                    <FormSubmitButton1 
                        submitting={props.updating}
                    >
                        Update
                    </FormSubmitButton1>
                    <FormCancelButton1 
                        onCancel={props.onCancel}
                    >
                        Cancel
                    </FormCancelButton1>
                </div>
            </form>
        </div>
    );
};
export default SettingsCard;