import { useEffect } from 'react';
import { Unity, useUnityContext } from 'react-unity-webgl';
import { useSaveGardenLoaded, useSaveGardenProgress } from '@app/global';

export const UnityGardenControl = (props: any) => {
    const saveGardenLoaded = useSaveGardenLoaded();
    const saveGardenProgress = useSaveGardenProgress();

    const { unityProvider, isLoaded, loadingProgression } = useUnityContext({
        loaderUrl: "/unity/garden/Garden.loader.js",
        dataUrl: "/unity/garden/Garden.data",
        frameworkUrl: "/unity/garden/Garden.framework.js",
        codeUrl: "/unity/garden/Garden.wasm",
    });

    useEffect(() => {
        if (!isLoaded) {
            saveGardenLoaded(false);
        } else {
            saveGardenLoaded(true);
        }
    }, [isLoaded]);

    useEffect(() => {
        saveGardenProgress(Math.round(loadingProgression * 100));
    }, [loadingProgression]);

    return (
        <div {...props}>
            <Unity
                unityProvider={unityProvider}
                className={`w-full h-full ${isLoaded ? 'visible' : 'hidden'}`}
            />
        </div>
    );
};

export default UnityGardenControl;