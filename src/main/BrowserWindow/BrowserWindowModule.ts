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
        const operatingSystem = dependencyInjector.getInstance<OperatingSystem>("OperatingSystem");

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

        dependencyInjector.registerInstance<BrowserWindow>(
            "BrowserWindow",
            new BrowserWindow(browserWindowConstructorOptionsMap[operatingSystem]),
        );

        BrowserWindowModule.registerBrowserWindowEventListeners(dependencyInjector);
        BrowserWindowModule.registerNativeThemeEventListeners(dependencyInjector);
        BrowserWindowModule.registerEvents(dependencyInjector);
        await BrowserWindowModule.loadFileOrUrl(dependencyInjector);
    }

    private static registerBrowserWindowEventListeners(dependencyInjector: DependencyInjector) {
        const browserWindow = dependencyInjector.getInstance<BrowserWindow>("BrowserWindow");
        const settingsManager = dependencyInjector.getInstance<SettingsManager>("SettingsManager");

        browserWindow.on("blur", () => {
            if (settingsManager.getSettingByKey("window.hideWindowOnBlur", true)) {
                browserWindow.hide();
            }
        });
    }

    private static registerEvents(dependencyInjector: DependencyInjector) {
        const eventSubscriber = dependencyInjector.getInstance<EventSubscriber>("EventSubscriber");
        const browserWindow = dependencyInjector.getInstance<BrowserWindow>("BrowserWindow");
        const settingsManager = dependencyInjector.getInstance<SettingsManager>("SettingsManager");

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
    }

    private static registerNativeThemeEventListeners(dependencyInjector: DependencyInjector) {
        const nativeTheme = dependencyInjector.getInstance<NativeTheme>("NativeTheme");
        const browserWindow = dependencyInjector.getInstance<BrowserWindow>("BrowserWindow");

        nativeTheme.addListener("updated", () => browserWindow.webContents.send("nativeThemeChanged"));
    }

    private static async loadFileOrUrl(dependencyInjector: DependencyInjector) {
        const app = dependencyInjector.getInstance<App>("App");
        const browserWindow = dependencyInjector.getInstance<BrowserWindow>("BrowserWindow");

        await (app.isPackaged
            ? browserWindow.loadFile(join(__dirname, "..", "dist-renderer", "index.html"))
            : browserWindow.loadURL(process.env.VITE_DEV_SERVER_URL));
    }
}
