import type { SearchResultItemAction } from "@common/SearchResultItemAction";
import type { App, BrowserWindow, BrowserWindowConstructorOptions, NativeTheme } from "electron";
import { join } from "path";
import type { DependencyInjector } from "../DependencyInjector";
import type { EventSubscriber } from "../EventSubscriber";
import type { UeliCommandInvokedEvent } from "../Extensions/UeliCommand";
import type { SettingsManager } from "../SettingsManager";
import type { TrayIconMenuItemClickedEvent } from "../TrayIcon";
import { createBrowserWindow } from "./createBrowserWindow";
import { getBackgroundMaterial } from "./getBackgroundMaterial";
import { openAndFocusBrowserWindow } from "./openAndFocusBrowserWindow";
import { sendToBrowserWindow } from "./sendToBrowserWindow";
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

        eventSubscriber.subscribe("searchIndexUpdated", () => browserWindow.webContents.send("searchIndexUpdated"));

        eventSubscriber.subscribe("actionInvokationSucceeded", ({ action }: { action: SearchResultItemAction }) => {
            const shouldHideWindow =
                settingsManager.getSettingByKey("window.hideWindowAfterExecution", true) &&
                action.hideWindowAfterInvokation;

            shouldHideWindow && browserWindow.hide();
        });

        eventSubscriber.subscribe("hotkeyPressed", () => toggleBrowserWindow(app, browserWindow));

        eventSubscriber.subscribe("settingUpdated", ({ key, value }: { key: string; value: unknown }) => {
            sendToBrowserWindow(browserWindow, "settingUpdated", { key, value });
        });

        eventSubscriber.subscribe(
            "settingUpdated[window.backgroundMaterial]",
            ({ value }: { value: BrowserWindowConstructorOptions["backgroundMaterial"] }) => {
                browserWindow.setBackgroundMaterial(getBackgroundMaterial(value));
            },
        );

        BrowserWindowModule.registerTrayIconEvents(browserWindow, eventSubscriber);
        BrowserWindowModule.registerUeliCommandEvents(browserWindow, eventSubscriber);
    }

    private static registerTrayIconEvents(browserWindow: BrowserWindow, eventSubscriber: EventSubscriber) {
        eventSubscriber.subscribe("trayIconMenuItemClicked", (event: TrayIconMenuItemClickedEvent) => {
            if (event.navigateTo) {
                const { pathname } = event.navigateTo;
                openAndFocusBrowserWindow(browserWindow);
                sendToBrowserWindow(browserWindow, "navigateTo", { pathname });
            }
        });
    }

    private static registerUeliCommandEvents(browserWindow: BrowserWindow, eventSubscriber: EventSubscriber) {
        eventSubscriber.subscribe("ueliCommandInvoked", (event: UeliCommandInvokedEvent) => {
            if (event.navigateTo) {
                const { pathname } = event.navigateTo;
                sendToBrowserWindow(browserWindow, "navigateTo", { pathname });
            }
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
