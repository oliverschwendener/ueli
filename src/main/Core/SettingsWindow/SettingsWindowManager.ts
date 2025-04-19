import type { BrowserWindowAppIconFilePathResolver, BrowserWindowHtmlLoader } from "@Core/BrowserWindow";
import type { BrowserWindowRegistry } from "@Core/BrowserWindowRegistry";
import type { EventEmitter } from "@Core/EventEmitter";
import type { Translator } from "@Core/Translator";
import { type App, BrowserWindow } from "electron";
import { join } from "path";

export class SettingsWindowManager {
    private static readonly SettingsWindowId = "settings";

    private browserWindow?: BrowserWindow;

    public constructor(
        private readonly browserWindowAppIconFilePathResolver: BrowserWindowAppIconFilePathResolver,
        private readonly translator: Translator,
        private readonly app: App,
        private readonly browserWindowRegistry: BrowserWindowRegistry,
        private readonly eventEmitter: EventEmitter,
        private readonly htmlLoader: BrowserWindowHtmlLoader,
    ) {}

    public async getWindow(): Promise<BrowserWindow> {
        if (this.browserWindow === undefined || this.browserWindow?.isDestroyed()) {
            this.browserWindow = await this.createBrowserWindow();
        }

        return this.browserWindow;
    }

    public getWindowTitle(): string {
        const { t } = this.translator.createT({
            "en-US": { settingsWindowTitle: "Settings" },
            "de-CH": { settingsWindowTitle: "Einstellungen" },
            "ja-JP": { settingsWindowTitle: "設定" },
            "ko-KR": { settingsWindowTitle: "설정" },
        });

        return t("settingsWindowTitle");
    }

    private async createBrowserWindow(): Promise<BrowserWindow> {
        const settingsWindow = new BrowserWindow({
            show: false,
            height: 800,
            width: 1000,
            autoHideMenuBar: true,
            icon: this.browserWindowAppIconFilePathResolver.getAppIconFilePath(),
            title: this.getWindowTitle(),
            webPreferences: {
                preload: join(__dirname, "..", "dist-preload", "index.js"),
                spellcheck: false,

                // The dev tools should only be available in development mode. Once the app is packaged, the dev tools
                // should be disabled.
                devTools: !this.app.isPackaged,

                // The following options are needed for images with `file://` URLs to work during development
                allowRunningInsecureContent: !this.app.isPackaged,
                webSecurity: this.app.isPackaged,
            },
        });

        this.browserWindowRegistry.register(SettingsWindowManager.SettingsWindowId, settingsWindow);

        settingsWindow.on("close", () => {
            this.browserWindowRegistry.remove(SettingsWindowManager.SettingsWindowId);
            this.eventEmitter.emitEvent("settingsWindowClosed");
        });

        if (this.app.isPackaged) {
            settingsWindow.removeMenu();
        }

        await this.htmlLoader.loadHtmlFile(settingsWindow, "settings.html");

        return settingsWindow;
    }
}
