import type { BrowserWindow } from "electron";

export const showAndFocusBrowserWindow = (browserWindow: BrowserWindow) => {
    if (!browserWindow.isVisible()) {
        browserWindow.show();
    }

    browserWindow.focus();
};
