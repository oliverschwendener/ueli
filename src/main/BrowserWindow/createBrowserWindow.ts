import { OperatingSystem } from "@common/OperatingSystem";
import { BrowserWindow, type App, type BrowserWindowConstructorOptions } from "electron";
import { join } from "path";

export const createBrowserWindow = (app: App, operatingSystem: OperatingSystem) => {
    const preloadScriptFilePath = join(__dirname, "..", "dist-preload", "index.js");

    const browserWindowConstructorOptionsMap: Record<OperatingSystem, BrowserWindowConstructorOptions> = {
        macOS: {
            webPreferences: {
                preload: preloadScriptFilePath,
                webSecurity: app.isPackaged,
                spellcheck: false,
            },
            frame: false,
        },
        Windows: {
            autoHideMenuBar: true,
            webPreferences: {
                preload: preloadScriptFilePath,
                webSecurity: app.isPackaged,
                spellcheck: false,
            },
            frame: false,
        },
    };

    return new BrowserWindow(browserWindowConstructorOptionsMap[operatingSystem]);
};
