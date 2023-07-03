import { OperatingSystem } from "@common/OperatingSystem";
import { app, BrowserWindow, BrowserWindowConstructorOptions, ipcMain, nativeTheme } from "electron";
import { join } from "path";
import { platform } from "process";

const preloadScriptFilePath = app.isPackaged
    ? join(__dirname, "..", "..", "dist-electron", "preload", "index.js")
    : join(__dirname, "..", "preload", "index.js");

const browserWindowConstructorOptionsMap: Record<OperatingSystem, BrowserWindowConstructorOptions> = {
    macOS: {
        webPreferences: {
            preload: preloadScriptFilePath,
        },
        vibrancy: "window",
        frame: false,
    },
    Windows: {
        autoHideMenuBar: true,
        webPreferences: {
            preload: preloadScriptFilePath,
        },
        backgroundMaterial: "mica",
        transparent: true,
    },
};

(async () => {
    await app.whenReady();

    const operatingSysetem = platform === "win32" ? "Windows" : "macOS";
    const browserWindow = new BrowserWindow(browserWindowConstructorOptionsMap[operatingSysetem]);

    app.isPackaged
        ? browserWindow.loadFile(join(__dirname, "..", "..", "dist", "index.html"))
        : browserWindow.loadURL(process.env.VITE_DEV_SERVER_URL);

    ipcMain.on("themeShouldUseDarkColors", (event) => (event.returnValue = nativeTheme.shouldUseDarkColors));

    nativeTheme.addListener("updated", () => browserWindow.webContents.send("nativeThemeChanged"));
})();
