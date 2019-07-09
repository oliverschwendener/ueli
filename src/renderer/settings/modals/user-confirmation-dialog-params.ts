export interface UserConfirmationDialogParams {
    callback: () => void;
    message: string;
    modalTitle: string;
    type: UserConfirmationDialogType;
}

export enum UserConfirmationDialogType {
    Default,
    Error,
}
