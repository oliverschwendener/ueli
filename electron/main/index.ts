import { OperatingSystem } from "@common/OperatingSystem";
import { app, BrowserWindow, BrowserWindowConstructorOptions, ipcMain, nativeTheme } from "electron";
import { join } from "path";
import { platform } from "process";
import { MacOsApplicationSearch, Plugin } from "./Plugins";
import { SearchIndex } from "./SearchIndex";
import { SettingsManager } from "./Settings";
import { SettingsFileReader } from "./Settings/SettingsFileReader";
import { SettingsFileWriter } from "./Settings/SettingsFileWriter";

const settingsFilePath = join(app.getPath("userData"), "ueli9.settings.json");

const settingsManager = new SettingsManager(
    new SettingsFileReader(settingsFilePath),
    new SettingsFileWriter(settingsFilePath),
);

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
        },
    },
};

(async () => {
    await app.whenReady();

    const operatingSysetem = platform === "win32" ? "Windows" : "macOS";
    const browserWindow = new BrowserWindow(browserWindowConstructorOptionsMap[operatingSysetem]);

    const searchIndex = new SearchIndex(() => browserWindow.webContents.send("searchIndexUpdated"));

    const plugins: Plugin[] = [new MacOsApplicationSearch(searchIndex)];

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
