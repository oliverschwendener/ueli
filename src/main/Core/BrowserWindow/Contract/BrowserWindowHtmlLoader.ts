import type { BrowserWindow } from "electron";

export interface BrowserWindowHtmlLoader {
    loadHtmlFile(browserWindow: BrowserWindow, fileName: string): Promise<void>;
}
