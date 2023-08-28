import { OperatingSystem } from "@common/OperatingSystem";
import { BrowserWindow, type App, type BrowserWindowConstructorOptions, type NativeTheme } from "electron";
import { join } from "path";
import { EventSubscriber } from "../EventEmitter";

export const useBrowserWindow = async ({
    app,
    operatingSystem,
    eventSubscriber,
    nativeTheme,
}: {
    app: App;
    operatingSystem: OperatingSystem;
    eventSubscriber: EventSubscriber;
    nativeTheme: NativeTheme;
}): Promise<void> => {
    const preloadScriptFilePath = app.isPackaged
        ? join(__dirname, "..", "..", "dist-electron", "preload", "index.js")
        : join(__dirname, "..", "preload", "index.js");

    const browserWindowConstructorOptionsMap: Record<OperatingSystem, BrowserWindowConstructorOptions> = {
        macOS: {
            webPreferences: {
                preload: preloadScriptFilePath,
                webSecurity: app.isPackaged ? true : false,
                spellcheck: false,
            },
            frame: false,
        },
        Windows: {
            autoHideMenuBar: true,
            webPreferences: {
                preload: preloadScriptFilePath,
                webSecurity: app.isPackaged ? true : false,
                spellcheck: false,
            },
            frame: false,
        },
    };

    const browserWindow = new BrowserWindow(browserWindowConstructorOptionsMap[operatingSystem]);

    eventSubscriber.subscribe("searchResultItemsUpdated", () => browserWindow.webContents.send("searchIndexUpdated"));
    nativeTheme.addListener("updated", () => browserWindow.webContents.send("nativeThemeChanged"));

    app.isPackaged
        ? await browserWindow.loadFile(join(__dirname, "..", "..", "dist", "index.html"))
        : await browserWindow.loadURL(process.env.VITE_DEV_SERVER_URL);
};
