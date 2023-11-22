import type { App, BrowserWindow } from "electron";

export const toggleBrowserWindow = (app: App, browserWindow: BrowserWindow) => {
    if (browserWindow.isVisible() && browserWindow.isFocused()) {
        app.hide && app.hide();
        browserWindow.hide();
    } else {
        app.show && app.show();
        browserWindow.show();
        browserWindow.focus();
        browserWindow.webContents.send("windowFocused");
    }
};
