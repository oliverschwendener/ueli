import type { Dependencies } from "@Core/Dependencies";
import type { DependencyRegistry } from "@Core/DependencyRegistry";
import type { EventSubscriber } from "@Core/EventSubscriber";
import type { UeliCommand, UeliCommandInvokedEvent } from "@Core/UeliCommand";
import type { SearchResultItemAction } from "@common/Core";
import type { BrowserWindow, BrowserWindowConstructorOptions } from "electron";
import { join } from "path";
import { createBrowserWindow } from "./createBrowserWindow";
import { getAppIconFilePath } from "./getAppIconFilePath";
import { getBackgroundMaterial } from "./getBackgroundMaterial";
import { getVibrancy } from "./getVibrancy";
import { openAndFocusBrowserWindow } from "./openAndFocusBrowserWindow";
import { sendToBrowserWindow } from "./sendToBrowserWindow";
import { toggleBrowserWindow } from "./toggleBrowserWindow";

export class BrowserWindowModule {
    public static async bootstrap(dependencyRegistry: DependencyRegistry<Dependencies>) {
        const eventEmitter = dependencyRegistry.get("EventEmitter");
        const nativeTheme = dependencyRegistry.get("NativeTheme");

        const browserWindow = createBrowserWindow(dependencyRegistry);

        eventEmitter.emitEvent("browserWindowCreated", { browserWindow });

        nativeTheme.addListener("updated", () =>
            browserWindow.setIcon(
                getAppIconFilePath(
                    dependencyRegistry.get("NativeTheme"),
                    dependencyRegistry.get("AssetPathResolver"),
                    dependencyRegistry.get("OperatingSystem"),
                ),
            ),
        );

        BrowserWindowModule.registerBrowserWindowEventListeners(browserWindow, dependencyRegistry);
        BrowserWindowModule.registerEvents(browserWindow, dependencyRegistry);
        await BrowserWindowModule.loadFileOrUrl(browserWindow, dependencyRegistry);
    }

    private static registerBrowserWindowEventListeners(
        browserWindow: BrowserWindow,
        dependencyRegistry: DependencyRegistry<Dependencies>,
    ) {
        const settingsManager = dependencyRegistry.get("SettingsManager");

        browserWindow.on("blur", () => {
            if (settingsManager.getValue("window.hideWindowOnBlur", true)) {
                browserWindow.hide();
            }
        });
    }

    private static registerEvents(browserWindow: BrowserWindow, dependencyRegistry: DependencyRegistry<Dependencies>) {
        const app = dependencyRegistry.get("App");
        const eventSubscriber = dependencyRegistry.get("EventSubscriber");
        const settingsManager = dependencyRegistry.get("SettingsManager");

        eventSubscriber.subscribe("actionInvocationSucceeded", ({ action }: { action: SearchResultItemAction }) => {
            const shouldHideWindow =
                settingsManager.getValue("window.hideWindowAfterExecution", true) && action.hideWindowAfterInvocation;

            shouldHideWindow && browserWindow.hide();
        });

        eventSubscriber.subscribe("hotkeyPressed", () => toggleBrowserWindow(app, browserWindow));

        eventSubscriber.subscribe("settingUpdated", ({ key, value }: { key: string; value: unknown }) => {
            sendToBrowserWindow(browserWindow, `settingUpdated[${key}]`, { value });
        });

        eventSubscriber.subscribe("settingUpdated[window.alwaysOnTop]", ({ value }: { value: boolean }) => {
            browserWindow.setAlwaysOnTop(value);
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

    private static async loadFileOrUrl(
        browserWindow: BrowserWindow,
        dependencyRegistry: DependencyRegistry<Dependencies>,
    ) {
        const app = dependencyRegistry.get("App");

        await (app.isPackaged
            ? browserWindow.loadFile(join(__dirname, "..", "dist-renderer", "index.html"))
            : browserWindow.loadURL(process.env.VITE_DEV_SERVER_URL));
    }
}
