import { OperatingSystem } from "@common/OperatingSystem";
import { BrowserWindow, type App, type BrowserWindowConstructorOptions } from "electron";
import { join } from "path";

export const useBrowserWindow = (app: App, operatingSystem: OperatingSystem): BrowserWindow => {
    const preloadScriptFilePath = app.isPackaged
        ? join(__dirname, "..", "..", "dist-electron", "preload", "index.js")
        : join(__dirname, "..", "preload", "index.js");

    const browserWindowConstructorOptionsMap: Record<OperatingSystem, BrowserWindowConstructorOptions> = {
        macOS: {
            webPreferences: {
                preload: preloadScriptFilePath,
            },
            frame: false,
        },
        Windows: {
            autoHideMenuBar: true,
            webPreferences: {
                preload: preloadScriptFilePath,
                webSecurity: false,
            },
            frame: false,
        },
    };

    return new BrowserWindow(browserWindowConstructorOptionsMap[operatingSystem]);
};
