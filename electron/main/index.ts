import { OperatingSystem } from "@common/OperatingSystem";
import { app, BrowserWindow, BrowserWindowConstructorOptions, ipcMain, nativeTheme } from "electron";
import { join } from "path";
import { platform } from "process";
import { SearchIndex } from "./SearchIndex";

const settings: Record<string, unknown> = {};

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

const registerIpcMainEventHandlers = (searchIndex: SearchIndex) => {
    ipcMain.on("themeShouldUseDarkColors", (event) => (event.returnValue = nativeTheme.shouldUseDarkColors));
    ipcMain.on("getRescanState", (event) => (event.returnValue = searchIndex.getRescanState()));
    ipcMain.on("getSearchResultItems", (event) => (event.returnValue = searchIndex.getSearchResultItems()));

    ipcMain.on(
        "getSettingByKey",
        (event, { key, defaultValue }: { key: string; defaultValue: unknown }) =>
            (event.returnValue = settings[key] ?? defaultValue),
    );

    ipcMain.handle("updateSettingByKey", (_, { key, value }: { key: string; value: unknown }) => {
        settings[key] = value;
        return Promise.resolve();
    });
};

const registerNativeThemeEventHandlers = (browserWindow: BrowserWindow) => {
    nativeTheme.addListener("updated", () => browserWindow.webContents.send("nativeThemeChanged"));
};

(async () => {
    await app.whenReady();

    const operatingSysetem = platform === "win32" ? "Windows" : "macOS";
    const browserWindow = new BrowserWindow(browserWindowConstructorOptionsMap[operatingSysetem]);

    const searchIndex = new SearchIndex(
        () => browserWindow.webContents.send("searchIndexUpdated"),
        (rescanState) => browserWindow.webContents.send("rescanStateChanged", rescanState),
    );

    searchIndex.rescan();

    app.isPackaged
        ? browserWindow.loadFile(join(__dirname, "..", "..", "dist", "index.html"))
        : browserWindow.loadURL(process.env.VITE_DEV_SERVER_URL);

    registerIpcMainEventHandlers(searchIndex);
    registerNativeThemeEventHandlers(browserWindow);
})();
