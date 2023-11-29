import type { SearchResultItemAction } from "@common/SearchResultItemAction";
import type { App, BrowserWindow, NativeTheme } from "electron";
import { join } from "path";
import type { DependencyInjector } from "../DependencyInjector";
import type { EventSubscriber } from "../EventSubscriber";
import type { OperatingSystem } from "../OperatingSystem";
import type { SettingsManager } from "../SettingsManager";
import { createBrowserWindow } from "./createBrowserWindow";
import { toggleBrowserWindow } from "./toggleBrowserWindow";

export class BrowserWindowModule {
    public static async bootstrap(dependencyInjector: DependencyInjector) {
        const app = dependencyInjector.getInstance<App>("App");
        const eventSubscriber = dependencyInjector.getInstance<EventSubscriber>("EventSubscriber");
        const nativeTheme = dependencyInjector.getInstance<NativeTheme>("NativeTheme");
        const operatingSystem = dependencyInjector.getInstance<OperatingSystem>("OperatingSystem");
        const settingsManager = dependencyInjector.getInstance<SettingsManager>("SettingsManager");

        const browserWindow = createBrowserWindow(app, operatingSystem);

        BrowserWindowModule.registerBrowserWindowEventListeners(browserWindow, settingsManager);
        BrowserWindowModule.registerNativeThemeEventListeners(browserWindow, nativeTheme);
        BrowserWindowModule.registerEvents(app, browserWindow, eventSubscriber, settingsManager);
        await BrowserWindowModule.loadFileOrUrl(app, browserWindow);
    }

    private static registerBrowserWindowEventListeners(browserWindow: BrowserWindow, settingsManager: SettingsManager) {
        browserWindow.on("blur", () => {
            if (settingsManager.getSettingByKey("window.hideWindowOnBlur", true)) {
                browserWindow.hide();
            }
        });
    }

    private static registerEvents(
        app: App,
        browserWindow: BrowserWindow,
        eventSubscriber: EventSubscriber,
        settingsManager: SettingsManager,
    ) {
        eventSubscriber.subscribe("searchIndexUpdated", () => browserWindow.webContents.send("searchIndexUpdated"));

        eventSubscriber.subscribe("actionInvokationSucceeded", ({ action }: { action: SearchResultItemAction }) => {
            const shouldHideWindow =
                settingsManager.getSettingByKey("window.hideWindowAfterExecution", true) &&
                action.hideWindowAfterInvokation;

            shouldHideWindow && browserWindow.hide();
        });

        eventSubscriber.subscribe("hotkeyPressed", () => toggleBrowserWindow(app, browserWindow));
    }

    private static registerNativeThemeEventListeners(browserWindow: BrowserWindow, nativeTheme: NativeTheme) {
        nativeTheme.addListener("updated", () => browserWindow.webContents.send("nativeThemeChanged"));
    }

    private static async loadFileOrUrl(app: App, browserWindow: BrowserWindow) {
        await (app.isPackaged
            ? browserWindow.loadFile(join(__dirname, "..", "dist-renderer", "index.html"))
            : browserWindow.loadURL(process.env.VITE_DEV_SERVER_URL));
    }
}
