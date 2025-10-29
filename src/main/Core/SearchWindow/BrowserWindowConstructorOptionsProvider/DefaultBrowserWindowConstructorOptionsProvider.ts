import type { AppIconFilePathResolver } from "@Core/AppIconFilePathResolver";
import type { SettingsManager } from "@Core/SettingsManager";
import type { App } from "electron";
import { join } from "path";
import type { BrowserWindowConstructorOptionsProvider } from "./BrowserWindowConstructorOptionsProvider";
import { defaultWindowSize } from "./defaultWindowSize";

export class DefaultBrowserWindowConstructorOptionsProvider implements BrowserWindowConstructorOptionsProvider {
    public constructor(
        private readonly app: App,
        private readonly settingsManager: SettingsManager,
        private readonly appIconFilePathResolver: AppIconFilePathResolver,
    ) {}

    public get(): Electron.BrowserWindowConstructorOptions {
        return {
            ...defaultWindowSize,
            frame: false,
            show: this.settingsManager.getValue<boolean>("window.showOnStartup", true),
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
            alwaysOnTop: this.settingsManager.getValue<boolean>("window.alwaysOnTop", false),
            icon: this.appIconFilePathResolver.resolve(),
        };
    }
}
