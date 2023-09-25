import type { OperatingSystem } from "@common/OperatingSystem";
import type { SearchResultItem } from "@common/SearchResultItem";
import { BrowserWindow, type App, type BrowserWindowConstructorOptions, type NativeTheme } from "electron";
import { join } from "path";
import type { EventSubscriber } from "../EventSubscriber";
import type { SettingsManager } from "../Settings";

export const useBrowserWindow = async ({
    app,
    currentOperatingSystem,
    eventSubscriber,
    nativeTheme,
    settingsManager,
}: {
    app: App;
    currentOperatingSystem: OperatingSystem;
    eventSubscriber: EventSubscriber;
    nativeTheme: NativeTheme;
    settingsManager: SettingsManager;
}): Promise<void> => {
    const preloadScriptFilePath = app.isPackaged
        ? join(__dirname, "..", "..", "dist-electron", "preload", "index.js")
        : join(__dirname, "..", "preload", "index.js");

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

    const browserWindow = new BrowserWindow(browserWindowConstructorOptionsMap[currentOperatingSystem]);

    eventSubscriber.subscribe("searchIndexUpdated", () => browserWindow.webContents.send("searchIndexUpdated"));

    eventSubscriber.subscribe("executionSucceeded", ({ searchResultItem }: { searchResultItem: SearchResultItem }) => {
        if (
            settingsManager.getSettingByKey("window.hideWindowAfterExecution", true) &&
            searchResultItem.hideWindowAfterExecution
        ) {
            browserWindow.hide();
        }
    });

    nativeTheme.addListener("updated", () => browserWindow.webContents.send("nativeThemeChanged"));

    app.isPackaged
        ? await browserWindow.loadFile(join(__dirname, "..", "..", "dist", "index.html"))
        : await browserWindow.loadURL(process.env.VITE_DEV_SERVER_URL);
};
