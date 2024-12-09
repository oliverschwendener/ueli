import type { CustomWebBrowserActionHandler } from "./CustomWebBrowserActionHandler";

export class WindowsCustomWebBrowserActionHandler implements CustomWebBrowserActionHandler {
    public isEnabled(): boolean {
        return false;
    }

    public async openUrl(url: string): Promise<void> {
        throw new Error("Not implemented");
    }
}
