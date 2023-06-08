"use strict";
const electron = require("electron");
const path = require("path");
const createBrowserWindow = (appIsPackaged) => {
  const preloadScriptFilePath = appIsPackaged ? path.join(__dirname, "..", "..", "dist-electron", "preload", "index.js") : path.join(__dirname, "..", "preload", "index.js");
  return new electron.BrowserWindow({
    autoHideMenuBar: true,
    webPreferences: {
      preload: preloadScriptFilePath
    },
    vibrancy: "window",
    backgroundMaterial: "auto",
    frame: false,
    height: 60
  });
};
const loadFileOrUrl = (browserWindow, appIsPackaged) => {
  appIsPackaged ? browserWindow.loadFile(path.join(__dirname, "..", "..", "dist", "index.html")) : browserWindow.loadURL(process.env.VITE_DEV_SERVER_URL);
};
const registerIpcEventListeners = (browserWindow) => {
  electron.ipcMain.on("themeShouldUseDarkColors", (event) => {
    event.returnValue = electron.nativeTheme.shouldUseDarkColors;
  });
  electron.ipcMain.on(
    "settingsOpenStateChanged",
    (_, { settingsOpened }) => browserWindow.setBounds({ height: settingsOpened ? 600 : 60 })
  );
};
const registerNativeThemeEventListeners = (allBrowserWindows) => {
  electron.nativeTheme.addListener("updated", () => {
    for (const browserWindow of allBrowserWindows) {
      browserWindow.webContents.send("nativeThemeChanged");
    }
  });
};
(async () => {
  await electron.app.whenReady();
  const browserWindow = createBrowserWindow(electron.app.isPackaged);
  loadFileOrUrl(browserWindow, electron.app.isPackaged);
  registerIpcEventListeners(browserWindow);
  registerNativeThemeEventListeners(electron.BrowserWindow.getAllWindows());
})();
//# sourceMappingURL=index.js.map
