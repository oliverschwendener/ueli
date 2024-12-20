import type { BrowserWindowBackgroundMaterialProvider } from "@Core/BrowserWindow";
import type { BrowserWindowConstructorOptions } from "electron";
import type { BrowserWindowConstructorOptionsProvider } from "./BrowserWindowConstructorOptionsProvider";

export class WindowsBrowserWindowConstructorOptionsProvider implements BrowserWindowConstructorOptionsProvider {
    public constructor(
        private readonly defaultOptions: BrowserWindowConstructorOptions,
        private readonly backgroundMaterialProvider: BrowserWindowBackgroundMaterialProvider,
    ) {}

    public get(): Electron.BrowserWindowConstructorOptions {
        return {
            ...this.defaultOptions,
            ...{
                autoHideMenuBar: true,
                backgroundMaterial: this.backgroundMaterialProvider.get(),
            },
        };
    }
}
