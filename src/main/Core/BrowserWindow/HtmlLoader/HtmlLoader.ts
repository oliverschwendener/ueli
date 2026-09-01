import { join } from "path";

import type { EnvironmentVariableProvider } from "@Core/EnvironmentVariableProvider";
import type { BrowserWindow } from "electron";

import type { BrowserWindowHtmlLoader } from "../Contract";

export class HtmlLoader implements BrowserWindowHtmlLoader {
    public constructor(private readonly environmentVariableProvider: EnvironmentVariableProvider) {}

    public async loadHtmlFile(browserWindow: BrowserWindow, fileName: string): Promise<void> {
        const viteDevServerUrl = this.environmentVariableProvider.get("ELECTRON_RENDERER_URL");

        if (viteDevServerUrl) {
            await browserWindow.loadURL(`${viteDevServerUrl}/${fileName}`);
        } else {
            await browserWindow.loadFile(join(__dirname, "..", "dist-renderer", fileName));
        }
    }
}
