import { BrowserWindow } from "electron";
import type { BrowserWindowNotifier as BrowserWindowNotifierInterface } from "./Contract";

export class BrowserWindowNotifier implements BrowserWindowNotifierInterface {
    public notify<T>(channel: string, data?: T) {
        for (const browserWindow of Object.values(BrowserWindow.getAllWindows())) {
            if (!browserWindow.isDestroyed()) {
                browserWindow.webContents.send(channel, data);
            }
        }
    }
}
