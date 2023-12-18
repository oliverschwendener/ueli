import type { SearchResultItemAction } from "@common/SearchResultItemAction";
import type { App, BrowserWindow, NativeTheme } from "electron";
import { join } from "path";
import type { DependencyInjector } from "../DependencyInjector";
import type { EventSubscriber } from "../EventSubscriber";
import type { SettingsManager } from "../SettingsManager";
import { createBrowserWindow } from "./createBrowserWindow";
import { toggleBrowserWindow } from "./toggleBrowserWindow";

export class BrowserWindowModule {
    public static async bootstrap(dependencyInjector: DependencyInjector) {
        const browserWindow = createBrowserWindow(dependencyInjector);

        BrowserWindowModule.registerBrowserWindowEventListeners(browserWindow, dependencyInjector);
        BrowserWindowModule.registerNativeThemeEventListeners(browserWindow, dependencyInjector);
        BrowserWindowModule.registerEvents(browserWindow, dependencyInjector);
        await BrowserWindowModule.loadFileOrUrl(browserWindow, dependencyInjector);
    }

    private static registerBrowserWindowEventListeners(
        browserWindow: BrowserWindow,
        dependencyInjector: DependencyInjector,
    ) {
        const settingsManager = dependencyInjector.getInstance<SettingsManager>("SettingsManager");

        browserWindow.on("blur", () => {
            if (settingsManager.getSettingByKey("window.hideWindowOnBlur", true)) {
                browserWindow.hide();
            }
        });
    }

    private static registerEvents(browserWindow: BrowserWindow, dependencyInjector: DependencyInjector) {
        const app = dependencyInjector.getInstance<App>("App");
        const eventSubscriber = dependencyInjector.getInstance<EventSubscriber>("EventSubscriber");
        const settingsManager = dependencyInjector.getInstance<SettingsManager>("SettingsManager");

        const openAndFocusBrowserWindow = (b: BrowserWindow) => {
            if (!b.isVisible()) {
                b.show();
            }

            b.focus();
        };

        eventSubscriber.subscribe("searchIndexUpdated", () => browserWindow.webContents.send("searchIndexUpdated"));

        eventSubscriber.subscribe("actionInvokationSucceeded", ({ action }: { action: SearchResultItemAction }) => {
            const shouldHideWindow =
                settingsManager.getSettingByKey("window.hideWindowAfterExecution", true) &&
                action.hideWindowAfterInvokation;

            shouldHideWindow && browserWindow.hide();
        });

        eventSubscriber.subscribe("hotkeyPressed", () => toggleBrowserWindow(app, browserWindow));

        eventSubscriber.subscribe("trayIconContextMenuShowClicked", () => openAndFocusBrowserWindow(browserWindow));

        eventSubscriber.subscribe("trayIconContextMenuSettingsClicked", () => {
            openAndFocusBrowserWindow(browserWindow);
            browserWindow.webContents.send("openSettings");
        });

        eventSubscriber.subscribe("trayIconContextMenuAboutClicked", () => {
            openAndFocusBrowserWindow(browserWindow);
            browserWindow.webContents.send("openAbout");
        });
    }

    private static registerNativeThemeEventListeners(
        browserWindow: BrowserWindow,
        dependencyInjector: DependencyInjector,
    ) {
        const nativeTheme = dependencyInjector.getInstance<NativeTheme>("NativeTheme");

        nativeTheme.addListener("updated", () => browserWindow.webContents.send("nativeThemeChanged"));
    }

    private static async loadFileOrUrl(browserWindow: BrowserWindow, dependencyInjector: DependencyInjector) {
        const app = dependencyInjector.getInstance<App>("App");

        await (app.isPackaged
            ? browserWindow.loadFile(join(__dirname, "..", "dist-renderer", "index.html"))
            : browserWindow.loadURL(process.env.VITE_DEV_SERVER_URL));
    }
}
