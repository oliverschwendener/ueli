import type { App, BrowserWindow } from "electron";
import type { BrowserWindowToggler } from "./BrowserWindowToggler";
import { ElectronBrowserWindowToggler } from "./ElectronBrowserWindowToggler";

export const useBrowserWindowToggler = ({
    app,
    browserWindow,
}: {
    app: App;
    browserWindow: BrowserWindow;
}): BrowserWindowToggler => new ElectronBrowserWindowToggler(app, browserWindow);
