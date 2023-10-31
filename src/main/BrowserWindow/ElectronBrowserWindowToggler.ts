import type { App, BrowserWindow } from "electron";
import type { BrowserWindowToggler } from "./BrowserWindowToggler";

export class ElectronBrowserWindowToggler implements BrowserWindowToggler {
    public constructor(
        private readonly app: App,
        private readonly browserWindow: BrowserWindow,
    ) {}

    public toggleWindow() {
        if (this.browserWindow.isVisible() && this.browserWindow.isFocused()) {
            this.app.hide();
            this.browserWindow.hide();
        } else {
            this.app.show();
            this.browserWindow.show();
            this.browserWindow.focus();
        }
    }
}
