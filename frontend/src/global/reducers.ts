import { initialStates } from '@app/global';

export const SET_LIGHT_MODE = 'SET_LIGHT_MODE';
export const SET_GARDEN_LOADED = 'SET_GARDEN_LOADED';
export const SET_OASIS_LOADED = 'SET_OASIS_LOADED';
export const SET_GARDEN_PROGRESS = 'SET_GARDEN_PROGRESS';
export const SET_OASIS_PROGRESS = 'SET_OASIS_PROGRESS';
export const SET_UNITY_BACKGROUND_MODE = 'SET_UNITY_BACKGROUND_MODE';
export const SET_TOKEN = 'SET_TOKEN';
export const SET_INITIAL_VALUE = 'SET_INITIAL_VALUE';

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
        case SET_INITIAL_VALUE:
            return {
                ...state,
                gardenLoaded: initialStates.gardenLoaded,
                oasisLoaded: initialStates.oasisLoaded,
                gardenProgress: initialStates.gardenProgress,
                oasisProgress: initialStates.oasisProgress,
            }
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
export const setGardenProgress = (gardenProgress: any) => ({
    type: SET_GARDEN_PROGRESS,
    payload: gardenProgress,
});
export const setOasisProgress = (oasisProgress: any) => ({
    type: SET_OASIS_PROGRESS,
    payload: oasisProgress,
});
export const setUnityBackgroundMode = (unityBackgroundMode: any) => ({
    type: SET_UNITY_BACKGROUND_MODE,
    payload: unityBackgroundMode,
});
export const setToken = (token: string) => ({
    type: SET_TOKEN,
    payload: token,
});
export const setInitialValue = () => ({
    type: SET_INITIAL_VALUE,
});

export default reducer;