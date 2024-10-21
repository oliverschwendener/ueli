import type { BrowserWindow } from "electron";
import type { BrowserWindowNotifier as BrowserWindowNotifierInterface } from "./Contract";

export class BrowserWindowNotifier implements BrowserWindowNotifierInterface {
    private browserWindow?: BrowserWindow;

    public setBrowserWindow(browserWindow: BrowserWindow) {
        this.browserWindow = browserWindow;
    }

    public notify<T>(channel: string, data?: T) {
        this.browserWindow?.webContents.send(channel, data);
    }
}
