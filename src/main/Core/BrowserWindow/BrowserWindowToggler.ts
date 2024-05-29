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

    private isVisibleAndFocused(): boolean {
        return this.browserWindow.isVisible() && this.browserWindow.isFocused();
    }

    private hide(): void {
        this.app.hide && this.app.hide();

        if (this.operatingSystem === "Windows") {
            this.browserWindow.minimize();
        }

        this.browserWindow.hide();
    }

    private showAndFocus(bounds?: Rectangle): void {
        this.app.show && this.app.show();

        if (this.operatingSystem === "Windows") {
            this.browserWindow.restore();
        }

        this.repositionWindow(bounds);

        this.browserWindow.show();
        this.browserWindow.focus();
        this.browserWindow.webContents.send("windowFocused");
    }

    private repositionWindow(bounds: Rectangle): void {
        this.browserWindow.setBounds(bounds ?? this.defaultSize);

        if (!bounds || this.alwaysCenter()) {
            this.browserWindow.center();
        }
    }

    private alwaysCenter(): boolean {
        return this.settingsManager.getValue("window.alwaysCenter", false);
    }
}
