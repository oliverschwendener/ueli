import type { BrowserWindow } from "electron";

export interface BrowserWindowRegistry {
    remove(id: string): void;
    register(id: string, window: BrowserWindow): void;
    getById(id: string): BrowserWindow | undefined;
    getAll(): BrowserWindow[];
}
