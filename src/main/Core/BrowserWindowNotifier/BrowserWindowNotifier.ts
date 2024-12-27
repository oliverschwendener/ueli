import type { BrowserWindowRegistry } from "@Core/BrowserWindowRegistry";
import type { BrowserWindowNotifier as BrowserWindowNotifierInterface } from "./Contract";

export class BrowserWindowNotifier implements BrowserWindowNotifierInterface {
    public constructor(private readonly browserWindowRegistry: BrowserWindowRegistry) {}

    public notify<T>({ browserWindowId, channel, data }: { browserWindowId: string; channel: string; data?: T }) {
        const browserWindow = this.browserWindowRegistry.getById(browserWindowId);

        if (!browserWindow.isDestroyed()) {
            browserWindow.webContents.send(channel, data);
        }
    }

    public notifyAll<T>({ channel, data }: { channel: string; data?: T }) {
        const aliveBrowserWindows = this.browserWindowRegistry
            .getAll()
            .filter((browserWindow) => !browserWindow.isDestroyed());

        for (const browserWindow of aliveBrowserWindows) {
            browserWindow.webContents.send(channel, data);
        }
    }
}
