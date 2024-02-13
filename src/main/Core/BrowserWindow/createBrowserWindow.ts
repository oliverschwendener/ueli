import type { Dependencies } from "@Core/Dependencies";
import type { DependencyRegistry } from "@Core/DependencyRegistry";
import type { OperatingSystem } from "@common/Core";
import { BrowserWindow, type BrowserWindowConstructorOptions } from "electron";
import { join } from "path";
import { getBackgroundMaterial } from "./getBackgroundMaterial";
import { getVibrancy } from "./getVibrancy";

export const createBrowserWindow = (dependencyRegistry: DependencyRegistry<Dependencies>) => {
    const app = dependencyRegistry.get("App");
    const operatingSystem = dependencyRegistry.get("OperatingSystem");
    const settingsManager = dependencyRegistry.get("SettingsManager");

    const preloadScriptFilePath = join(__dirname, "..", "dist-preload", "index.js");

    const defaultBrowserWindowOptions: BrowserWindowConstructorOptions = {
        width: 750,
        height: 500,
        frame: false,
        webPreferences: {
            preload: preloadScriptFilePath,
            webSecurity: app.isPackaged,
            allowRunningInsecureContent: !app.isPackaged,
            spellcheck: false,
        },
    };

    const extendDefaultBrowserWindowOptions = (browserWindowOptions: BrowserWindowConstructorOptions) => {
        return {
            ...defaultBrowserWindowOptions,
            ...browserWindowOptions,
        };
    };

    const browserWindowOptionsMap: Record<OperatingSystem, BrowserWindowConstructorOptions> = {
        macOS: extendDefaultBrowserWindowOptions({
            vibrancy: getVibrancy(settingsManager.getValue("window.vibrancy", "None")),
            backgroundColor: "rgba(0,0,0,0)",
        }),
        Windows: extendDefaultBrowserWindowOptions({
            autoHideMenuBar: true,
            backgroundMaterial: getBackgroundMaterial(settingsManager.getValue("window.backgroundMaterial", "Mica")),
        }),
        Linux: extendDefaultBrowserWindowOptions({}),
    };

    return new BrowserWindow(browserWindowOptionsMap[operatingSystem]);
};
