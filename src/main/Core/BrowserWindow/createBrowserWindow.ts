import type { Dependencies } from "@Core/Dependencies";
import type { DependencyRegistry } from "@Core/DependencyRegistry";
import type { OperatingSystem } from "@common/Core";
import { BrowserWindow, type BrowserWindowConstructorOptions } from "electron";
import { join } from "path";
import { defaultWindowSize } from "./defaultWindowSize";
import { getAppIconFilePath } from "./getAppIconFilePath";
import { getBackgroundMaterial } from "./getBackgroundMaterial";
import { getVibrancy } from "./getVibrancy";

export const createBrowserWindow = (dependencyRegistry: DependencyRegistry<Dependencies>) => {
    const app = dependencyRegistry.get("App");
    const operatingSystem = dependencyRegistry.get("OperatingSystem");
    const settingsManager = dependencyRegistry.get("SettingsManager");

    const show = settingsManager.getValue<boolean>("window.showOnStartup", true);
    const alwaysOnTop = settingsManager.getValue<boolean>("window.alwaysOnTop", false);

    const preloadScriptFilePath = join(__dirname, "..", "dist-preload", "index.js");

    const defaultBrowserWindowOptions: BrowserWindowConstructorOptions = {
        ...defaultWindowSize,
        frame: false,
        show,
        webPreferences: {
            preload: preloadScriptFilePath,
            webSecurity: app.isPackaged,
            allowRunningInsecureContent: !app.isPackaged,
            spellcheck: false,
        },
        alwaysOnTop,
        icon: getAppIconFilePath(
            dependencyRegistry.get("NativeTheme"),
            dependencyRegistry.get("AssetPathResolver"),
            dependencyRegistry.get("OperatingSystem"),
        ),
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
