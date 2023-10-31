import type { App, BrowserWindow, GlobalShortcut } from "electron";

export const useGlobalShortcut = ({
    app,
    browserWindow,
    globalShortcut,
}: {
    app: App;
    browserWindow: BrowserWindow;
    globalShortcut: GlobalShortcut;
}) => {
    globalShortcut.register("alt+space", () => {
        if (browserWindow.isVisible() && browserWindow.isFocused()) {
            app.hide();
            browserWindow.hide();
        } else {
            browserWindow.show();
            browserWindow.focus();
        }
    });
};
