export interface CustomWebBrowserActionHandler {
    openUrl(url: string): Promise<void>;
    isEnabled(): boolean;
}
