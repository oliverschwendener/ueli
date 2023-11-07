import type { BrowserWindowToggler } from "@common/BrowserWindowToggler";
import type { App, BrowserWindow } from "electron";

export class ElectronBrowserWindowToggler implements BrowserWindowToggler {
    public constructor(
        private readonly app: App,
        private readonly browserWindow: BrowserWindow,
    ) {}

    public toggleWindow() {
        if (this.browserWindow.isVisible() && this.browserWindow.isFocused()) {
            this.app.hide && this.app.hide();
            this.browserWindow.hide();
        } else {
            this.app.show && this.app.show();
            this.browserWindow.show();
            this.browserWindow.focus();
            this.browserWindow.webContents.send("windowFocused");
        }
    }
}
