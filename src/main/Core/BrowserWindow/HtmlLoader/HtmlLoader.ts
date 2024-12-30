import type { EnvironmentVariableProvider } from "@Core/EnvironmentVariableProvider";
import type { App, BrowserWindow } from "electron";
import { join } from "path";
import type { BrowserWindowHtmlLoader } from "../Contract";

export class HtmlLoader implements BrowserWindowHtmlLoader {
    public constructor(
        private readonly app: App,
        private readonly environmentVariableProvider: EnvironmentVariableProvider,
    ) {}

    public async loadHtmlFile(browserWindow: BrowserWindow, fileName: string): Promise<void> {
        if (this.app.isPackaged) {
            await browserWindow.loadFile(join(__dirname, "..", "dist-renderer", fileName));
        } else {
            await browserWindow.loadURL(`${this.environmentVariableProvider.get("VITE_DEV_SERVER_URL")}/${fileName}`);
        }
    }
}
