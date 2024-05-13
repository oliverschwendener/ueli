import type { SettingsManager } from "@Core/SettingsManager";
import type { OperatingSystem } from "@common/Core";
import { BrowserWindow, type App, type BrowserWindowConstructorOptions } from "electron";
import { join } from "path";
import { AppIconFilePathResolver } from "./AppIconFilePathResolver";
import { defaultWindowSize } from "./defaultWindowSize";
import { getBackgroundMaterial } from "./getBackgroundMaterial";
import { getVibrancy } from "./getVibrancy";

const extendDefaultBrowserWindowOptions = (
    defaultBrowserWindowOptions: BrowserWindowConstructorOptions,
    browserWindowOptions: BrowserWindowConstructorOptions,
) => ({ ...defaultBrowserWindowOptions, ...browserWindowOptions });

export const createBrowserWindow = ({
    app,
    operatingSystem,
    settingsManager,
    appIconFilePathResolver,
}: {
    app: App;
    operatingSystem: OperatingSystem;
    settingsManager: SettingsManager;
    appIconFilePathResolver: AppIconFilePathResolver;
}) => {
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
        icon: appIconFilePathResolver.getAppIconFilePath(),
    };

    const browserWindowOptionsMap: Record<OperatingSystem, BrowserWindowConstructorOptions> = {
        macOS: extendDefaultBrowserWindowOptions(defaultBrowserWindowOptions, {
            vibrancy: getVibrancy(settingsManager.getValue("window.vibrancy", "None")),
            backgroundColor: "rgba(0,0,0,0)",
        }),
        Windows: extendDefaultBrowserWindowOptions(defaultBrowserWindowOptions, {
            autoHideMenuBar: true,
            backgroundMaterial: getBackgroundMaterial(settingsManager.getValue("window.backgroundMaterial", "Mica")),
        }),
        Linux: extendDefaultBrowserWindowOptions(defaultBrowserWindowOptions, {}),
    };

    return new BrowserWindow(browserWindowOptionsMap[operatingSystem]);
};
