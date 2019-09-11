export interface UrlOptions {
    isEnabled: boolean;
    defaultProtocol: string;
}

export const defaultUrlOptions: UrlOptions = {
    defaultProtocol: "https",
    isEnabled: true,
};
