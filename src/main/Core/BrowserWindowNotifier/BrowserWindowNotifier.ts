import type { BrowserWindow } from "electron";
import type { BrowserWindowNotifier as BrowserWindowNotifierInterface } from "./Contract";

export class BrowserWindowNotifier implements BrowserWindowNotifierInterface {
    private browserWindows: Record<string, BrowserWindow> = {};

    public addBrowserWindow({ id, browserWindow }: { id: string; browserWindow: BrowserWindow }) {
        if (Object.keys(this.browserWindows).includes(id)) {
            throw new Error(`Unable to add browser window for id ${id} because it already exists`);
        }

        this.browserWindows[id] = browserWindow;
    }

    public notify<T>(channel: string, data?: T) {
        for (const browserWindow of Object.values(this.browserWindows)) {
            browserWindow.webContents.send(channel, data);
        }
    }
}
