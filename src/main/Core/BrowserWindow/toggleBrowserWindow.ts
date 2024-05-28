import type { App, BrowserWindow, Rectangle, Size } from "electron";

const repositionWindow = ({
    browserWindow,
    defaultSize,
    alwaysCenter,
    bounds,
}: {
    browserWindow: BrowserWindow;
    defaultSize: Size;
    alwaysCenter: boolean;
    bounds?: Rectangle;
}) => {
    browserWindow.setBounds(bounds ?? defaultSize);

    if (!bounds || alwaysCenter) {
        browserWindow.center();
    }
};

export const toggleBrowserWindow = ({
    app,
    browserWindow,
    defaultSize,
    alwaysCenter,
    bounds,
}: {
    app: App;
    browserWindow: BrowserWindow;
    defaultSize: Size;
    alwaysCenter: boolean;
    bounds?: Rectangle;
}) => {
    if (browserWindow.isVisible() && browserWindow.isFocused()) {
        app.hide && app.hide();
        browserWindow.minimize();
        browserWindow.hide();
    } else {
        app.show && app.show();

        browserWindow.restore();

        repositionWindow({ browserWindow, defaultSize, alwaysCenter, bounds });

        browserWindow.show();
        browserWindow.focus();
        browserWindow.webContents.send("windowFocused");
    }
};
