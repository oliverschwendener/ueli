import type { BrowserWindow } from "electron";

export const sendToBrowserWindow = <T>(browserWindow: BrowserWindow, channel: string, argument: T) => {
    browserWindow.webContents.send(channel, argument);
};
