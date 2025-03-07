import { useDispatch, useSelector } from 'react-redux';

import { 
    setLightMode,
    setGardenLoaded,
    setOasisLoaded,
    setGardenProgress,
    setOasisProgress,
    setUnityBackgroundMode,
    setToken,
    setInitialValue,
    setVideo1Loaded,
    setVideo2Loaded,
    setVideoBackgroundMode,
    setUserInfo,
} from '@app/global';
import { ReduxStorage, UnityBackgroundType, UserInfoStorageData } from '@app/types';

export const useSaveLightMode = () => {
    const dispatch = useDispatch();
    return (lightMode: boolean) => dispatch(setLightMode(lightMode));
};
export const useSaveGardenLoaded = () => {
    const dispatch = useDispatch();
    return (gardenLoaded: boolean) => dispatch(setGardenLoaded(gardenLoaded));
};
export const useSaveOasisLoaded = () => {
    const dispatch = useDispatch();
    return (oasisLoaded: boolean) => dispatch(setOasisLoaded(oasisLoaded));
};
export const useSaveGardenProgress = () => {
    const dispatch = useDispatch();
    return (gardenProgress: number) => dispatch(setGardenProgress(gardenProgress));
};
export const useSaveOasisProgress = () => {
    const dispatch = useDispatch();
    return (oasisProgress: number) => dispatch(setOasisProgress(oasisProgress));
};
export const useSaveUnityBackgroundMode = () => {
    const dispatch = useDispatch();
    return (unityBackgroundMode: UnityBackgroundType) => dispatch(setUnityBackgroundMode(unityBackgroundMode));
};
export const useSaveToken = () => {
    const dispatch = useDispatch();
    return (token: string) => dispatch(setToken(token));
};
export const useSaveVideo1Loaded = () => {
    const dispatch = useDispatch();
    return (video1Loaded: boolean) => dispatch(setVideo1Loaded(video1Loaded));
};
export const useSaveVideo2Loaded = () => {
    const dispatch = useDispatch();
    return (video2Loaded: boolean) => dispatch(setVideo2Loaded(video2Loaded));
};
export const useSaveVideoBackgroundMode = () => {
    const dispatch = useDispatch();
    return (videoBackgroundMode: number) => dispatch(setVideoBackgroundMode(videoBackgroundMode));
};
export const useSaveUserInfo = () => {
    const dispatch = useDispatch();
    return (userInfo?: UserInfoStorageData) => dispatch(setUserInfo(userInfo));
};

export const useLightMode = () => {
    return useSelector((state: ReduxStorage) => state.lightMode);
};
export const useGardenLoaded = () => {
    return useSelector((state: ReduxStorage) => state.gardenLoaded);
};
export const useOasisLoaded = () => {
    return useSelector((state: ReduxStorage) => state.oasisLoaded);
};
export const useGardenProgress = () => {
    return useSelector((state: ReduxStorage) => state.gardenProgress);
};
export const useOasisProgress = () => {
    return useSelector((state: ReduxStorage) => state.oasisProgress);
};
export const useUnityBackgroundMode = () => {
    return useSelector((state: ReduxStorage) => state.unityBackgroundMode);
};
export const useToken = () => {
    return useSelector((state: ReduxStorage) => state.token);
};
export const useUserInfo = () => {
    return useSelector((state: ReduxStorage) => state.userInfo);
};
export const useVideo1Loaded = () => {
    return useSelector((state: ReduxStorage) => state.video1Loaded);
};

export const useVideo2Loaded = () => {
    return useSelector((state: ReduxStorage) => state.video2Loaded);
};

export const useVideoBackgroundMode = () => {
    return useSelector((state: ReduxStorage) => state.videoBackgroundMode);
};


export const useSetInitialValue = () => {
    const dispatch = useDispatch();
    return () => dispatch(setInitialValue());
};