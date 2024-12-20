import type { BrowserWindowVibrancyProvider } from "@Core/BrowserWindow";
import type { BrowserWindowConstructorOptions } from "electron";
import type { BrowserWindowConstructorOptionsProvider } from "./BrowserWindowConstructorOptionsProvider";

export class MacOsBrowserWindowConstructorOptionsProvider implements BrowserWindowConstructorOptionsProvider {
    public constructor(
        private readonly defaultOptions: BrowserWindowConstructorOptions,
        private readonly vibrancyProvider: BrowserWindowVibrancyProvider,
    ) {}

    public get(): Electron.BrowserWindowConstructorOptions {
        return {
            ...this.defaultOptions,
            ...{
                vibrancy: this.vibrancyProvider.get() ?? undefined,
                backgroundColor: "rgba(0,0,0,0)",
            },
        };
    }
}
