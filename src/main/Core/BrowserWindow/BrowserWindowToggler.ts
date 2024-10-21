import type { SettingsManager } from "@Core/SettingsManager";
import type { OperatingSystem } from "@common/Core";
import type { App, BrowserWindow, Rectangle, Size } from "electron";

export class BrowserWindowToggler {
    public constructor(
        private readonly operatingSystem: OperatingSystem,
        private readonly app: App,
        private readonly browserWindow: BrowserWindow,
        private readonly defaultSize: Size,
        private readonly settingsManager: SettingsManager,
    ) {}

    public toggle(bounds?: Rectangle): void {
        if (this.isVisibleAndFocused()) {
            this.hide();
        } else {
            this.showAndFocus(bounds);
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

    public showAndFocus(bounds?: Rectangle): void {
        if (typeof this.app.show === "function") {
            this.app.show();
        }

        this.browserWindow.show();

        // Because the window is minimized on Windows when hidden, we need to restore it before focusing it.
        if (this.operatingSystem === "Windows") {
            this.browserWindow.restore();
        }

        this.repositionWindow(bounds);

        this.browserWindow.focus();
        this.browserWindow.webContents.send("windowFocused");
    }

    private repositionWindow(bounds?: Rectangle): void {
        this.browserWindow.setBounds(bounds ?? this.defaultSize);

        if (!bounds || this.alwaysCenter()) {
            this.browserWindow.center();
        }
    }

    private alwaysCenter(): boolean {
        return this.settingsManager.getValue("window.alwaysCenter", false);
    }
}
