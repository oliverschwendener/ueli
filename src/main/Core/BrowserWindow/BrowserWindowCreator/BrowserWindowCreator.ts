import { BrowserWindow } from "electron";
import type { BrowserWindowConstructorOptionsProvider } from "../BrowserWindowConstructorOptionsProvider";

export class BrowserWindowCreator {
    public constructor(
        private readonly browserWindowConstructorOptionsProvider: BrowserWindowConstructorOptionsProvider,
    ) {}

    public create(): BrowserWindow {
        return new BrowserWindow(this.browserWindowConstructorOptionsProvider.get());
    }
}
