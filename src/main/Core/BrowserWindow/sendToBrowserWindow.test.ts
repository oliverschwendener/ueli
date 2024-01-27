import type { BrowserWindow } from "electron";
import { describe, expect, it, vi } from "vitest";
import { sendToBrowserWindow } from "./sendToBrowserWindow";

describe(sendToBrowserWindow, () => {
    it("should send a message to the browser window", () => {
        const sendMock = vi.fn();

        const browserWindow = <BrowserWindow>{
            webContents: {
                send: (channel, args) => sendMock(channel, args),
            },
        };

        sendToBrowserWindow(browserWindow, "my channel", { some: "data" });

        expect(sendMock).toHaveBeenCalledWith("my channel", { some: "data" });
    });
});
