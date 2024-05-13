import type { BrowserWindowConstructorOptions } from "electron";
import type { BrowserWindowConstructorOptionsProvider } from "./BrowserWindowConstructorOptionsProvider";
import type { VibrancyProvider } from "./Vibrancy";

export class MacOsBrowserWindowConstructorOptionsProvider implements BrowserWindowConstructorOptionsProvider {
    public constructor(
        private readonly defaultOptions: BrowserWindowConstructorOptions,
        private readonly vibrancyProvider: VibrancyProvider,
    ) {}

    public get(): Electron.BrowserWindowConstructorOptions {
        return {
            ...this.defaultOptions,
            ...{
                vibrancy: this.vibrancyProvider.get(),
                backgroundColor: "rgba(0,0,0,0)",
            },
        };
    }
}
