import { OperatingSystem } from "@common/OperatingSystem";
import { app, BrowserWindow, BrowserWindowConstructorOptions, ipcMain, nativeTheme } from "electron";
import mitt from "mitt";
import { join } from "path";
import { platform } from "process";
import { useEventEmitter, useEventSubscriber } from "./EventEmitter";
import { useOperatingSystem } from "./OperatingSystem";
import { usePlugins } from "./Plugins";
import { useSearchIndex } from "./SearchIndex";
import { useSettingsManager } from "./Settings";

const operatingSystem = useOperatingSystem(platform);
const emitter = mitt<Record<string, unknown>>();
const eventEmitter = useEventEmitter(emitter);
const eventSubscriber = useEventSubscriber(emitter);
const settingsManager = useSettingsManager(app);
const searchIndex = useSearchIndex(eventEmitter);
const plugins = usePlugins(app, operatingSystem, searchIndex);

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

(async () => {
    await app.whenReady();

    const browserWindow = new BrowserWindow(browserWindowConstructorOptionsMap[operatingSystem]);

    eventSubscriber.subscribe("searchResultsUpdated", () => browserWindow.webContents.send("searchIndexUpdated"));

    for (const plugin of plugins) {
        plugin.addSearchResultItemsToSearchIndex();
    }

    app.isPackaged
        ? browserWindow.loadFile(join(__dirname, "..", "..", "dist", "index.html"))
        : browserWindow.loadURL(process.env.VITE_DEV_SERVER_URL);

    ipcMain.on("themeShouldUseDarkColors", (event) => (event.returnValue = nativeTheme.shouldUseDarkColors));
    ipcMain.on("getSearchResultItems", (event) => (event.returnValue = searchIndex.getSearchResultItems()));

    ipcMain.on(
        "getSettingByKey",
        (event, { key, defaultValue }: { key: string; defaultValue: unknown }) =>
            (event.returnValue = settingsManager.getSettingByKey(key, defaultValue)),
    );

    ipcMain.handle("updateSettingByKey", (_, { key, value }: { key: string; value: unknown }) =>
        settingsManager.saveSetting(key, value),
    );

    nativeTheme.addListener("updated", () => browserWindow.webContents.send("nativeThemeChanged"));
})();
