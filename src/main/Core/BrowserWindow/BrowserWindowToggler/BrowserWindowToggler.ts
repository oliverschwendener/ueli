import type { OperatingSystem } from "@common/Core";
import type { App, BrowserWindow } from "electron";

export class BrowserWindowToggler {
    public constructor(
        private readonly operatingSystem: OperatingSystem,
        private readonly app: App,
        private readonly browserWindow: BrowserWindow,
    ) {}

    public toggle(): void {
        if (this.isVisibleAndFocused()) {
            this.hide();
        } else {
            this.showAndFocus();
        }
    }

    public isVisibleAndFocused(): boolean {
        return this.browserWindow.isVisible() && this.browserWindow.isFocused();
    }

    public hide(): void {
        if (typeof this.app.hide === "function") {
            this.app.hide();
        }

        // In order to restore focus correctly to the previously focused window, we need to minimize the window on
        // Windows.
        if (this.operatingSystem === "Windows") {
            this.browserWindow.minimize();
        }

        this.browserWindow.hide();
    }

    public showAndFocus(): void {
        if (typeof this.app.show === "function") {
            this.app.show();
        }

        this.browserWindow.show();

        // Because the window is minimized on Windows when hidden, we need to restore it before focusing it.
        if (this.operatingSystem === "Windows") {
            this.browserWindow.restore();
        }

        this.browserWindow.focus();
        this.browserWindow.webContents.send("windowFocused");
    }
}
