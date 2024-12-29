import type { BrowserWindow } from "electron";
import type { BrowserWindowRegistry as BrowserWindowRegistryInterface } from "./Contract";

export class BrowserWindowRegistry implements BrowserWindowRegistryInterface {
    private browserWindows: Record<string, BrowserWindow> = {};

    public remove(id: string): void {
        if (Object.keys(this.browserWindows).includes(id)) {
            delete this.browserWindows[id];
        }
    }

    public register(id: string, window: BrowserWindow): void {
        if (Object.keys(this.browserWindows).includes(id)) {
            throw new Error(`BrowserWindow with id ${id} already registered`);
        }

        this.browserWindows[id] = window;
    }

    public getById(id: string): BrowserWindow | undefined {
        return this.browserWindows[id];
    }

    public getAll(): BrowserWindow[] {
        return Object.values(this.browserWindows);
    }
}
