import type { BrowserWindow } from "electron";
import { describe, expect, it, vi } from "vitest";
import { BrowserWindowNotifier } from "./BrowserWindowNotifier";

describe(BrowserWindowNotifier, () => {
    describe(BrowserWindowNotifier.prototype.notify, () => {
        it("should not do anything if browser window has not been set", () => {
            const browserWindowNotifier = new BrowserWindowNotifier();
            browserWindowNotifier.notify<{ message: string }>("myChannel", { message: "myMessage" });
        });

        it("should send message to browser window if window has been set", () => {
            const sendMock = vi.fn();

            const browserWindowNotifier = new BrowserWindowNotifier();

            const browserWindow = <BrowserWindow>{ webContents: { send: (c, a) => sendMock(c, a) } };

            browserWindowNotifier.addBrowserWindow({ id: "window1", browserWindow });
            browserWindowNotifier.notify<{ message: string }>("myChannel", { message: "myMessage" });

            expect(sendMock).toHaveBeenCalledWith("myChannel", { message: "myMessage" });
        });
    });
});
