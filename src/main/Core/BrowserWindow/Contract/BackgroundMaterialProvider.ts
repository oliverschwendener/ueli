import type { BrowserWindowConstructorOptions } from "electron";

export interface BrowserWindowBackgroundMaterialProvider {
    get(): BrowserWindowConstructorOptions["backgroundMaterial"];
}
