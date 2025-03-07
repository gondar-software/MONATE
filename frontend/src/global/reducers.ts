import { initialStates } from '@app/global';
import { UnityBackgroundType, UserInfoStorageData } from '@app/types';

export const SET_LIGHT_MODE = 'SET_LIGHT_MODE';
export const SET_GARDEN_LOADED = 'SET_GARDEN_LOADED';
export const SET_OASIS_LOADED = 'SET_OASIS_LOADED';
export const SET_GARDEN_PROGRESS = 'SET_GARDEN_PROGRESS';
export const SET_OASIS_PROGRESS = 'SET_OASIS_PROGRESS';
export const SET_UNITY_BACKGROUND_MODE = 'SET_UNITY_BACKGROUND_MODE';
export const SET_TOKEN = 'SET_TOKEN';
export const SET_USER_INFO = 'SET_USER_INFO';
export const SET_INITIAL_VALUE = 'SET_INITIAL_VALUE';
export const SET_VIDEO1_LOADED = 'SET_VIDEO1_LOADED';
export const SET_VIDEO2_LOADED = 'SET_VIDEO2_LOADED';
export const SET_VIDEO_BACKGROUND_MODE = 'SET_VIDEO_BACKGROUND_MODE';

export const reducer = (state = initialStates, action: any) => {
    switch (action.type) {
        case SET_LIGHT_MODE:
            return {
                ...state,
                lightMode: action.payload,
            };
        case SET_GARDEN_LOADED:
            return {
                ...state,
                gardenLoaded: action.payload,
            };
        case SET_OASIS_LOADED:
            return {
                ...state,
                oasisLoaded: action.payload,
            };
        case SET_GARDEN_PROGRESS:
            return {
                ...state,
                gardenProgress: action.payload,
            };
        case SET_OASIS_PROGRESS:
            return {
                ...state,
                oasisProgress: action.payload,
            };
        case SET_UNITY_BACKGROUND_MODE:
            return {
                ...state,
                unityBackgroundMode: action.payload,
            }
        case SET_TOKEN:
            return {
                ...state,
                token: action.payload,
            };
        case SET_USER_INFO:
            return {
                ...state,
                userInfo: action.payload,
            };
        case SET_VIDEO1_LOADED:
            return {
                ...state,
                video1Loaded: action.payload,
            };
        case SET_VIDEO2_LOADED:
            return {
                ...state,
                video2Loaded: action.payload,
            };
        case SET_VIDEO_BACKGROUND_MODE:
            return {
                ...state,
                videoBackgroundMode: action.payload,
            };
        case SET_INITIAL_VALUE:
            return {
                ...state,
                gardenLoaded: initialStates.gardenLoaded,
                oasisLoaded: initialStates.oasisLoaded,
                video1Loaded: initialStates.video1Loaded,
                video2Loaded: initialStates.video2Loaded,
                gardenProgress: initialStates.gardenProgress,
                oasisProgress: initialStates.oasisProgress,
            };
        default:
            return state;
    }
};

export const setLightMode = (lightMode: boolean) => ({
    type: SET_LIGHT_MODE,
    payload: lightMode,
});
export const setGardenLoaded = (unityLoaded: boolean) => ({
    type: SET_GARDEN_LOADED,
    payload: unityLoaded,
});
export const setOasisLoaded = (unityLoaded: boolean) => ({
    type: SET_OASIS_LOADED,
    payload: unityLoaded,
});
export const setGardenProgress = (gardenProgress: number) => ({
    type: SET_GARDEN_PROGRESS,
    payload: gardenProgress,
});
export const setOasisProgress = (oasisProgress: number) => ({
    type: SET_OASIS_PROGRESS,
    payload: oasisProgress,
});
export const setUnityBackgroundMode = (unityBackgroundMode: UnityBackgroundType) => ({
    type: SET_UNITY_BACKGROUND_MODE,
    payload: unityBackgroundMode,
});
export const setToken = (token: string) => ({
    type: SET_TOKEN,
    payload: token,
});
export const setUserInfo = (userInfo?: UserInfoStorageData) => ({
    type: SET_USER_INFO,
    payload: userInfo,
});
export const setVideo1Loaded = (video1Loaded: boolean) => ({
    type: SET_VIDEO1_LOADED,
    payload: video1Loaded,
});
export const setVideo2Loaded = (video2Loaded: boolean) => ({
    type: SET_VIDEO2_LOADED,
    payload: video2Loaded,
});
export const setVideoBackgroundMode = (videoBackgroundMode: number) => ({
    type: SET_VIDEO_BACKGROUND_MODE,
    payload: videoBackgroundMode,
});
export const setInitialValue = () => ({
    type: SET_INITIAL_VALUE,
});

export default reducer;