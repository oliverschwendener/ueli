import { BrowserWindow, type App, type BrowserWindowConstructorOptions } from "electron";
import { join } from "path";
import type { DependencyInjector } from "../DependencyInjector";
import type { OperatingSystem } from "../OperatingSystem";

export const createBrowserWindow = (dependencyInjector: DependencyInjector) => {
    const app = dependencyInjector.getInstance<App>("App");
    const operatingSystem = dependencyInjector.getInstance<OperatingSystem>("OperatingSystem");

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
        Linux: {},
    };

    return new BrowserWindow(browserWindowConstructorOptionsMap[operatingSystem]);
};
