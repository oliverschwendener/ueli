import type { BrowserWindow } from "electron";
import type { BrowserWindowRegistry as BrowserWindowRegistryInterface } from "./Contract";

export class BrowserWindowRegistry implements BrowserWindowRegistryInterface {
    private browserWindows: Record<string, BrowserWindow> = {};

    public register(id: string, window: BrowserWindow): void {
        if (Object.keys(this.browserWindows).includes(id)) {
            throw new Error(`BrowserWindow with id ${id} already registered`);
        }

        this.browserWindows[id] = window;
    }

    public getById(id: string): BrowserWindow {
        const browserWindow: BrowserWindow | undefined = this.browserWindows[id];

        if (!browserWindow) {
            throw new Error(`BrowserWindow with id ${id} not found`);
        }

        return browserWindow;
    }

    public getAll(): BrowserWindow[] {
        return Object.values(this.browserWindows);
    }
}
