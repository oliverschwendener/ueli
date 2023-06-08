import { app, BrowserWindow, ipcMain, IpcMainEvent, nativeTheme } from "electron";
import { join } from "path";

const createBrowserWindow = (appIsPackaged: boolean): BrowserWindow => {
    const preloadScriptFilePath = appIsPackaged
        ? join(__dirname, "..", "..", "dist-electron", "preload", "index.js")
        : join(__dirname, "..", "preload", "index.js");

    return new BrowserWindow({
        autoHideMenuBar: true,
        webPreferences: {
            preload: preloadScriptFilePath,
        },
        vibrancy: "window",
        backgroundMaterial: "auto",
        frame: false,
        height: 60,
    });
};

const loadFileOrUrl = (browserWindow: BrowserWindow, appIsPackaged: boolean) => {
    appIsPackaged
        ? browserWindow.loadFile(join(__dirname, "..", "..", "dist", "index.html"))
        : browserWindow.loadURL(process.env.VITE_DEV_SERVER_URL);
};

const registerIpcEventListeners = (browserWindow: BrowserWindow) => {
    ipcMain.on("themeShouldUseDarkColors", (event: IpcMainEvent) => {
        event.returnValue = nativeTheme.shouldUseDarkColors;
    });

    ipcMain.on("settingsOpenStateChanged", (_, { settingsOpened }: { settingsOpened: boolean }) =>
        browserWindow.setBounds({ height: settingsOpened ? 600 : 60 })
    );
};

const registerNativeThemeEventListeners = (allBrowserWindows: BrowserWindow[]) => {
    nativeTheme.addListener("updated", () => {
        for (const browserWindow of allBrowserWindows) {
            browserWindow.webContents.send("nativeThemeChanged");
        }
    });
};

(async () => {
    await app.whenReady();
    const browserWindow = createBrowserWindow(app.isPackaged);
    loadFileOrUrl(browserWindow, app.isPackaged);
    registerIpcEventListeners(browserWindow);
    registerNativeThemeEventListeners(BrowserWindow.getAllWindows());
})();
