import type { BrowserWindowConstructorOptions } from "electron";
import type { BrowserWindowConstructorOptionsProvider } from "./BrowserWindowConstructorOptionsProvider";

export class LinuxBrowserWindowConstructorOptionsProvider implements BrowserWindowConstructorOptionsProvider {
    public constructor(private readonly defaultOptions: BrowserWindowConstructorOptions) {}

    public get(): Electron.BrowserWindowConstructorOptions {
        return this.defaultOptions;
    }
}
