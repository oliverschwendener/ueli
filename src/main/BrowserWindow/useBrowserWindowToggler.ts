import type { BrowserWindowToggler } from "@common/BrowserWindowToggler";
import type { App, BrowserWindow } from "electron";
import { ElectronBrowserWindowToggler } from "./ElectronBrowserWindowToggler";

export const useBrowserWindowToggler = ({
    app,
    browserWindow,
}: {
    app: App;
    browserWindow: BrowserWindow;
}): BrowserWindowToggler => new ElectronBrowserWindowToggler(app, browserWindow);
