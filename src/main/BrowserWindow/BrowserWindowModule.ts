import type { DependencyInjector } from "@common/DependencyInjector";
import type { EventSubscriber } from "@common/EventSubscriber";
import type { OperatingSystem } from "@common/OperatingSystem";
import type { SearchResultItem } from "@common/SearchResultItem";
import type { SettingsManager } from "@common/SettingsManager";
import { BrowserWindow, type App, type BrowserWindowConstructorOptions, type NativeTheme } from "electron";
import { join } from "path";

export class BrowserWindowModule {
    public static async bootstrap(dependencyInjector: DependencyInjector) {
        const app = dependencyInjector.getInstance<App>("App");
        const settingsManager = dependencyInjector.getInstance<SettingsManager>("SettingsManager");
        const currentOperatingSystem = dependencyInjector.getInstance<OperatingSystem>("OperatingSystem");
        const eventSubscriber = dependencyInjector.getInstance<EventSubscriber>("EventSubscriber");
        const nativeTheme = dependencyInjector.getInstance<NativeTheme>("NativeTheme");

        const preloadScriptFilePath = join(__dirname, "..", "dist-preload", "index.js");

        const browserWindowConstructorOptionsMap: Record<OperatingSystem, BrowserWindowConstructorOptions> = {
            macOS: {
                webPreferences: {
                    preload: preloadScriptFilePath,
                    webSecurity: app.isPackaged,
                    spellcheck: false,
                },
                frame: false,
            },
            Windows: {
                autoHideMenuBar: true,
                webPreferences: {
                    preload: preloadScriptFilePath,
                    webSecurity: app.isPackaged,
                    spellcheck: false,
                },
                frame: false,
            },
        };

        const browserWindow = new BrowserWindow(browserWindowConstructorOptionsMap[currentOperatingSystem]);

        browserWindow.on("blur", () => {
            if (settingsManager.getSettingByKey("window.hideWindowOnBlur", true)) {
                browserWindow.hide();
            }
        });

        eventSubscriber.subscribe("searchIndexUpdated", () => browserWindow.webContents.send("searchIndexUpdated"));

        eventSubscriber.subscribe(
            "executionSucceeded",
            ({ searchResultItem }: { searchResultItem: SearchResultItem }) => {
                if (
                    settingsManager.getSettingByKey("window.hideWindowAfterExecution", true) &&
                    searchResultItem.hideWindowAfterExecution
                ) {
                    browserWindow.hide();
                }
            },
        );

        nativeTheme.addListener("updated", () => browserWindow.webContents.send("nativeThemeChanged"));

        await (app.isPackaged
            ? browserWindow.loadFile(join(__dirname, "..", "dist-renderer", "index.html"))
            : browserWindow.loadURL(process.env.VITE_DEV_SERVER_URL));

        dependencyInjector.registerInstance<BrowserWindow>("BrowserWindow", browserWindow);
    }
}
