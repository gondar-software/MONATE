import { useEffect } from 'react';
import { Unity, useUnityContext } from 'react-unity-webgl';
import { useSaveOasisLoaded, useSaveOasisProgress } from '@app/global';
import { UnityControlProps } from '@app/types';

export const UnityOasisControl = (props: UnityControlProps) => {
    const saveOasisLoaded = useSaveOasisLoaded();
    const saveOasisProgress = useSaveOasisProgress();

    const { unityProvider, isLoaded, loadingProgression } = useUnityContext({
        loaderUrl: "/unity/oasis/Oasis.loader.js",
        dataUrl: "/unity/oasis/Oasis.data",
        frameworkUrl: "/unity/oasis/Oasis.framework.js",
        codeUrl: "/unity/oasis/Oasis.wasm",
    });

    useEffect(() => {
        if (!isLoaded) {
            saveOasisLoaded(false);
        } else {
            saveOasisLoaded(true);
        }
    }, [isLoaded]);

    useEffect(() => {
        saveOasisProgress(Math.round(loadingProgression * 100));
    }, [loadingProgression]);

    return (
        <div className={props.className}>
            <Unity
                unityProvider={unityProvider}
                className={`w-full h-full ${isLoaded ? 'visible' : 'hidden'}`}
            />
        </div>
    );
};

export default UnityOasisControl;