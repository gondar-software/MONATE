import { AlertType, UIType } from "@app/types"

export interface AlertProviderProps {
    children?: UIType;
}

export interface AlertData {
    type: AlertType;
    id?: number;
    fadeOut?: boolean;
    title: string;
    message: string;
}

export interface FooterProviderProps {
    children?: UIType;
}

export interface HeaderProviderProps {
    children?: UIType;
}

export interface LoadingProviderProps {
    children?: UIType;
}

export interface UnityBackgroundProviderProps {
    children?: UIType;
}

export interface VideoBackgroundProviderProps {
    children?: UIType;
}