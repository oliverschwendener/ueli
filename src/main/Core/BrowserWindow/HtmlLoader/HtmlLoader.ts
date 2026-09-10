import { join } from "path";

import type { EnvironmentVariableProvider } from "@Core/EnvironmentVariableProvider";
import type { BrowserWindow } from "electron";

import type { BrowserWindowHtmlLoader } from "../Contract";

export class HtmlLoader implements BrowserWindowHtmlLoader {
    public constructor(private readonly environmentVariableProvider: EnvironmentVariableProvider) {}

    public async loadHtmlFile(browserWindow: BrowserWindow, fileName: string): Promise<void> {
        const rendererUrl = this.environmentVariableProvider.get("ELECTRON_RENDERER_URL");

        if (rendererUrl) {
            await browserWindow.loadURL(`${rendererUrl}/${fileName}`);
        } else {
            await browserWindow.loadFile(join(__dirname, "..", "renderer", fileName));
        }
    }
}
