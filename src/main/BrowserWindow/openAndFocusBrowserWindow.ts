import type { BrowserWindow } from "electron";

export const openAndFocusBrowserWindow = (browserWindow: BrowserWindow) => {
    if (!browserWindow.isVisible()) {
        browserWindow.show();
    }

    browserWindow.focus();
};
