import { ReduxStorage } from "@app/types";

export const initialStates: ReduxStorage = {
    lightMode: true,
    gardenLoaded: false,
    oasisLoaded: false,
    gardenProgress: 0,
    oasisProgress: 0,
    unityBackgroundMode: 'oasis',
    token: '',
    userInfo: undefined,
    video1Loaded: false,
    video2Loaded: false,
    videoBackgroundMode: 1,
};

export default initialStates;