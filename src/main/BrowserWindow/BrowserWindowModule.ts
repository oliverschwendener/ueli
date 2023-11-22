import type { DependencyInjector } from "@common/DependencyInjector";
import type { EventSubscriber } from "@common/EventSubscriber";
import type { OperatingSystem } from "@common/OperatingSystem";
import type { SearchResultItemAction } from "@common/SearchResultItemAction";
import type { SettingsManager } from "@common/SettingsManager";
import type { App, BrowserWindow, NativeTheme } from "electron";
import { join } from "path";
import { createBrowserWindow } from "./createBrowserWindow";

export class BrowserWindowModule {
    public static async bootstrap(dependencyInjector: DependencyInjector) {
        const app = dependencyInjector.getInstance<App>("App");
        const eventSubscriber = dependencyInjector.getInstance<EventSubscriber>("EventSubscriber");
        const nativeTheme = dependencyInjector.getInstance<NativeTheme>("NativeTheme");
        const operatingSystem = dependencyInjector.getInstance<OperatingSystem>("OperatingSystem");
        const settingsManager = dependencyInjector.getInstance<SettingsManager>("SettingsManager");

        const browserWindow = createBrowserWindow(app, operatingSystem);

        dependencyInjector.registerInstance<BrowserWindow>("BrowserWindow", browserWindow);

        BrowserWindowModule.registerBrowserWindowEventListeners(browserWindow, settingsManager);
        BrowserWindowModule.registerNativeThemeEventListeners(browserWindow, nativeTheme);
        BrowserWindowModule.registerEvents(browserWindow, eventSubscriber, settingsManager);
        await BrowserWindowModule.loadFileOrUrl(browserWindow, app);
    }

    private static registerBrowserWindowEventListeners(browserWindow: BrowserWindow, settingsManager: SettingsManager) {
        browserWindow.on("blur", () => {
            if (settingsManager.getSettingByKey("window.hideWindowOnBlur", true)) {
                browserWindow.hide();
            }
        });
    }

    private static registerEvents(
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
    }

    private static registerNativeThemeEventListeners(browserWindow: BrowserWindow, nativeTheme: NativeTheme) {
        nativeTheme.addListener("updated", () => browserWindow.webContents.send("nativeThemeChanged"));
    }

    private static async loadFileOrUrl(browserWindow: BrowserWindow, app: App) {
        await (app.isPackaged
            ? browserWindow.loadFile(join(__dirname, "..", "dist-renderer", "index.html"))
            : browserWindow.loadURL(process.env.VITE_DEV_SERVER_URL));
    }
}
