import type { SearchResultItemAction } from "@common/Core";
import type { App, BrowserWindow, BrowserWindowConstructorOptions, NativeTheme } from "electron";
import { join } from "path";
import type { DependencyInjector } from "../DependencyInjector";
import type { EventSubscriber } from "../EventSubscriber";
import type { SettingsManager } from "../SettingsManager";
import type { UeliCommand, UeliCommandInvokedEvent } from "../UeliCommand";
import { createBrowserWindow } from "./createBrowserWindow";
import { getBackgroundMaterial } from "./getBackgroundMaterial";
import { getVibrancy } from "./getVibrancy";
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
            if (settingsManager.getValue("window.hideWindowOnBlur", true)) {
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
                settingsManager.getValue("window.hideWindowAfterExecution", true) && action.hideWindowAfterInvokation;

            shouldHideWindow && browserWindow.hide();
        });

        eventSubscriber.subscribe("hotkeyPressed", () => toggleBrowserWindow(app, browserWindow));

        eventSubscriber.subscribe("settingUpdated", ({ key, value }: { key: string; value: unknown }) => {
            sendToBrowserWindow(browserWindow, `settingUpdated[${key}]`, { value });
        });

        eventSubscriber.subscribe(
            "settingUpdated[window.backgroundMaterial]",
            ({ value }: { value: BrowserWindowConstructorOptions["backgroundMaterial"] }) => {
                browserWindow.setBackgroundMaterial(getBackgroundMaterial(value));
            },
        );

        eventSubscriber.subscribe("settingUpdated[window.vibrancy]", ({ value }: { value: string }) => {
            browserWindow.setVibrancy(getVibrancy(value));
        });

        eventSubscriber.subscribe("navigateTo", ({ pathname }: { pathname: string }) => {
            openAndFocusBrowserWindow(browserWindow);
            sendToBrowserWindow(browserWindow, "navigateTo", { pathname });
        });

        BrowserWindowModule.registerUeliCommandEvents(browserWindow, eventSubscriber);
    }

    private static registerUeliCommandEvents(browserWindow: BrowserWindow, eventSubscriber: EventSubscriber) {
        const eventHandlers: { ueliCommands: UeliCommand[]; handler: (argument: unknown) => void }[] = [
            {
                ueliCommands: ["openAbout", "openExtensions", "openSettings", "show"],
                handler: ({ pathname }: { pathname: string }) => {
                    openAndFocusBrowserWindow(browserWindow);
                    sendToBrowserWindow(browserWindow, "navigateTo", { pathname });
                },
            },
            {
                ueliCommands: ["centerWindow"],
                handler: () => browserWindow.center(),
            },
        ];

        eventSubscriber.subscribe("ueliCommandInvoked", (event: UeliCommandInvokedEvent<unknown>) => {
            for (const eventHandler of eventHandlers) {
                if (eventHandler.ueliCommands.includes(event.ueliCommand)) {
                    eventHandler.handler(event.argument);
                }
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
