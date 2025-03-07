import { AuthModeType, ChatbotModelType, ComfyUIDataType, FileType, GenAIModelType, GenderType, PortfolioType, SlideType, UIType } from "@app/types";

export interface AccordionProps {
    index?: number;   
    items: AccordionItemData[];
    className?: string;
}

export interface AccordionItemData {
    header: UIType;
    body: UIType;
    id?: string;
    isOpen?: boolean;
}

export interface AccordionItemProps {
    header: UIType;
    body: UIType;
    id: string;
    isOpen: boolean;
    toggle?: React.MouseEventHandler<HTMLButtonElement>;
}

export interface AuthCardProps {
    mode: AuthModeType;
    submitting?: boolean;
    onSubmit: (formData: AuthCardData) => void;
}

export interface AuthCardData {
    email: string;
    password: string;
    rememberMe?: boolean;
}

export interface BadgeData {
    id: number;
    name: string;
}

export interface BadgePickerProps {
    badges?: BadgeData[];
    selectedBadges: BadgeData[];
    setSelectedBadges?: (badges: BadgeData[]) => void;
    maxBadges? : number;
    placeholder?: string;
    disabled? : boolean;
}

export interface BookCardProps {
    onSubmit: (bookData: BookerData) => void;
    booking?: boolean;
}

export interface BookerData {
    name: string;
    email: string;
    message: string;
}

export interface ChatbotNavbarCardProps {
    model: ChatbotModelType;
    setModel: (model: ChatbotModelType) => void;
    disabled?: boolean;
    onNewChat?: React.MouseEventHandler<HTMLButtonElement>;
    chatbotHistories?: ChatbotHistoryData[];
    onHistoryChoose: (index: number) => void;
    onDelete: (index: number) => void;
}

export interface ChatbotHistoryData {
    selected?: boolean;
    title?: string;
    chatId: string;
}

export interface CodeVerifyProps {
    length?: number;
    onComplete: (code: string) => void;
}

export interface ComfyUINavbarCardProps {
    model: GenAIModelType;
    onSubmit: (data: ComfyUIInputData) => void;
    setModel: (model: GenAIModelType) => void;
    processing?: boolean;
}

export interface ComfyUIInputData {
    name: string;
    value: string;
    type: ComfyUIDataType;
}

export interface ComfyUIOutputData {
    type?: ComfyUIDataType;
    value?: string;
}

export interface ComfyUIWorkData {
    id?: number;
    output?: ComfyUIOutputData;
    inputs?: ComfyUIInputData[];
    progress?: boolean;
}

export interface ComfyUIWorkCardProps {
    work: ComfyUIWorkData;
    progress?: UIType;
}

export interface FollowerData {
    rate: number;
    email: string;
    name: string;
    feedback?: string;
    avatar?: File;
}

export interface FollowCardProps {
    onSubmit: (data: FollowerData) => void;
    following?: boolean;
}

export interface InformationCardProps {
    onSubmit: (data: UserInfoData) => void;
    saving?: boolean;
}

export interface UserInfoData {
    firstName: string;
    middleName?: string;
    lastName: string;
    gender: GenderType;
    dob: string;
    address1: string;
    address2?: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    avatar?: File | string;
    githubUrl: string;
    phoneNumber: string;
}

export interface PortfolioData {
    type: SlideType;
    path: string;
}

export interface PortfolioCardProps {
    id: number;
}

export interface UnityControlProps {
    className?: string;
}

export interface UploadPortfolioCardProps {
    uploading?: boolean;
    onSubmit: (data: UploadPortfolioData) => void;
}

export interface UploadPortfolioSlideData {
    file?: File;
    fileType: FileType;
    filePath?: string;
}

export interface UploadPortfolioData {
    title: string;
    type: PortfolioType;
    url: string;
    categories: BadgeData[];
    slides: UploadPortfolioSlideData[];
}