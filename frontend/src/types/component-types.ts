import React from "react";

export interface AlertProps {
    mode: 'info' | 'danger' | 'success' | 'warning' | 'ignore';
    title: string;
    message: string;
    className?: string;
};

export interface AuthInfoProps {
    className?: string;
}

export interface AvatarProps {
    info?: {
        avatar?: string;
        name?: string;
        location?: string;
        email?: string;
        menu?: AvatarMenuItem[];
    };
    status?: 'active' | 'sleeping' | 'out';
    className?: string;
}

export interface AvatarMenuItem {
    label: string;
    url: string;
}

export interface BackgroundVideoProps {
    src: string;
    className?: string;
    onVideoLoaded: () => void;
}

export interface BadgeProps {
    mode: string,
    name: string,
    hiddenRemoveButton?: boolean,
    onCloseButtonClick?: React.MouseEventHandler<HTMLButtonElement>,
}

export interface TransparentButton1Props {
    className?: string;
    url: string;
    label: string;
}

export interface TransparentButton2Props {
    className?: string;
    children?: React.ReactNode | React.ReactNode[] | string;
    onClick?: React.MouseEventHandler<HTMLButtonElement>;
}

export interface FormSubmitButton1Props {
    submitting?: boolean;
    children?: React.ReactNode | React.ReactNode[] | string;
}

export interface FormLinkButton1Props {
    url: string;
    icon?: React.ReactNode | React.ReactNode[] | string;
    children?: React.ReactNode | React.ReactNode[] | string;
}

export interface FormLinkButton2Props {
    url: string;
    children?: React.ReactNode | React.ReactNode[] | string;
}

export interface FormDatePicker1Props {
    label: string;
    type: string;
    id: string;
    name: string;
    placeholder: string;
    value: string;
    onChange?: React.ChangeEventHandler<HTMLInputElement>;
}

export interface FormFileUploader1Props {
    label: string;
    setFileData: (fileData: File | null, type: string) => void;
}

export interface FormFileItem1Props {
    value: string;
    onDelete?: React.MouseEventHandler<HTMLButtonElement>;
}

export interface FormHeader1Props {
    children?: React.ReactNode | React.ReactNode[] | string;
}

export interface FormHeader2Props {
    children?: React.ReactNode | React.ReactNode[] | string;
}

export interface FormHeader3Props {
    children?: React.ReactNode | React.ReactNode[] | string;
}

export interface ImageUploaderProps {
    initUrl?: string;
    maxWidth?: number;
    maxHeight?: number;
    disabled?: boolean;
    onImageUpload: (file: File) => void;
    className?: string;
    id?: string;
}

export interface LoadingMonateProps {
    progress?: number;
    className?: string;
}

export interface MarkdownPreviewerProps {
    text: string;
    user?: boolean;
}

export interface ModeSwitchProps {
    className?: string;
}

export interface MonateMarkProps {
    className?: string;
}

export interface PagenationProps {
    initPage?: number;
    maxPage: number;
    onChangePage: (page: number) => void;
    label?: string;
}

export interface RagDocProps {
    doc: RagDoc[];
}

export interface RagDoc {
    link: string;
    title: string;
    snippet: string;
}

export interface FormSelect1Props {
    label: string;
    id: string;
    value: string;
    name: string;
    onChange?: React.ChangeEventHandler<HTMLSelectElement>;
    placeholder: string;
    options: FormSelect1Item[];
}

export interface FormSelect1Item {
    value: string;
    label: string;
}

export interface SlideViewerProps {
    images: string[];
    className?: string;
    slides: SlideData[];
    slidingButton?: boolean;
}

export interface SlideData {
    type: 'image' | 'video';
    url: string;
}

export interface StarRaterProps {
    rating: number;
    setRating: (rating: number) => void;
}

export interface StarRatingProps {
    rating: number
}

export interface MonateIconProps {
    className?: string;
}

export interface CopyrightIconProps {
    className?: string;
}

export interface LoadingSpinProps {
    className?: string;
}

export interface FormTextField1Props {
    label: string;
    type: string;
    id: string;
    name: string;
    placeholder: string;
    value: string;
    required?: boolean;
    onChange?: React.ChangeEventHandler<HTMLInputElement>;
}

export interface FormTextField2Props {
    label: string;
    type: string;
    id: string;
    name: string;
    placeholder: string;
    value: string;
    required?: boolean;
    onChange?: React.ChangeEventHandler<HTMLInputElement>;
}

export interface FormTextField3Props {
    label: string;
    type: string;
    id: string;
    name: string;
    placeholder: string;
    value: string;
    required?: boolean;
    disabled?: boolean;
    onChange?: React.ChangeEventHandler<HTMLTextAreaElement>;
}

export interface VideoUploaderProps {
    initUrl?: string;
    disabled?: boolean;
    onVideoUpload: (file: File) => void;
    className?: string;
    id?: string;
}