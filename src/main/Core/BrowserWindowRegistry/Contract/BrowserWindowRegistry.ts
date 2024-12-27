import type { BrowserWindow } from "electron";

export interface BrowserWindowRegistry {
    register(id: string, window: BrowserWindow): void;
    getById(id: string): BrowserWindow;
    getAll(): BrowserWindow[];
}
