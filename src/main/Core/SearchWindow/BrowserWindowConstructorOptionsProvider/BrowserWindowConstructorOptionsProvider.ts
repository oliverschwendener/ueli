import type { BrowserWindowConstructorOptions } from "electron";

export interface BrowserWindowConstructorOptionsProvider {
    get(): BrowserWindowConstructorOptions;
}
