import { BrowserWindow, type App, type BrowserWindowConstructorOptions } from "electron";
import { join } from "path";
import type { DependencyInjector } from "../DependencyInjector";
import type { OperatingSystem } from "../OperatingSystem";

export const createBrowserWindow = (dependencyInjector: DependencyInjector) => {
    const app = dependencyInjector.getInstance<App>("App");
    const operatingSystem = dependencyInjector.getInstance<OperatingSystem>("OperatingSystem");

    const preloadScriptFilePath = join(__dirname, "..", "dist-preload", "index.js");

    const defaultBrowserWindowOptions: BrowserWindowConstructorOptions = {
        webPreferences: {
            preload: preloadScriptFilePath,
            webSecurity: app.isPackaged,
            spellcheck: false,
        },
        frame: false,
    };

    const extendDefaultBrowserWindowOptions = (browserWindowOptions: BrowserWindowConstructorOptions) => {
        return {
            ...defaultBrowserWindowOptions,
            ...browserWindowOptions,
        };
    };

    const browserWindowOptionsMap: Record<OperatingSystem, BrowserWindowConstructorOptions> = {
        macOS: extendDefaultBrowserWindowOptions({}),
        Windows: extendDefaultBrowserWindowOptions({ autoHideMenuBar: true }),
        Linux: extendDefaultBrowserWindowOptions({}),
    };

    return new BrowserWindow(browserWindowOptionsMap[operatingSystem]);
};
