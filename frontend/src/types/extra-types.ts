import { GenderType, UnityBackgroundType, UserType } from "@app/types";

export interface ReduxStorage {
    lightMode: boolean;
    gardenLoaded: boolean;
    oasisLoaded: boolean;
    gardenProgress: number;
    oasisProgress: number;
    unityBackgroundMode: UnityBackgroundType;
    token: string;
    userInfo?: UserInfoStorageData;
    video1Loaded: boolean;
    video2Loaded: boolean;
    videoBackgroundMode: number;
}

export interface UserInfoStorageData {
    firstName: string;
    middleName?: string;
    lastName: string;
    gender: GenderType;
    dob: string;
    emailAddr: string;
    location: string;
    type: UserType;
    address1: string;
    address2?: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    avatar?: string;
    githubUrl: string;
    phoneNumber: string;
}