import type { Dependencies } from "@Core/Dependencies";
import type { DependencyRegistry } from "@Core/DependencyRegistry";
import type { EnvironmentVariableProvider } from "@Core/EnvironmentVariableProvider";
import type { EventSubscriber } from "@Core/EventSubscriber";
import type { SettingsManager } from "@Core/SettingsManager";
import type { UeliCommand, UeliCommandInvokedEvent } from "@Core/UeliCommand";
import type { App, BrowserWindow, BrowserWindowConstructorOptions } from "electron";
import { join } from "path";
import { WindowBoundsMemory } from "./WindowBoundsMemory";
import { createBrowserWindow } from "./createBrowserWindow";
import { defaultWindowSize } from "./defaultWindowSize";
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

        const windowBoundsMemory = new WindowBoundsMemory(dependencyRegistry.get("Screen"), {});

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

        BrowserWindowModule.registerBrowserWindowEventListeners(
            browserWindow,
            dependencyRegistry.get("SettingsManager"),
            windowBoundsMemory,
        );

        BrowserWindowModule.registerEvents(
            browserWindow,
            dependencyRegistry.get("App"),
            dependencyRegistry.get("EventSubscriber"),
            windowBoundsMemory,
            dependencyRegistry.get("SettingsManager"),
        );

        await BrowserWindowModule.loadFileOrUrl(browserWindow, dependencyRegistry.get("EnvironmentVariableProvider"));
    }

    private static registerBrowserWindowEventListeners(
        browserWindow: BrowserWindow,
        settingsManager: SettingsManager,
        windowBoundsMemory: WindowBoundsMemory,
    ) {
        const shouldHideWindowOnBlur = () => settingsManager.getValue("window.hideWindowOnBlur", true);

        browserWindow.on("blur", () => shouldHideWindowOnBlur() && browserWindow.hide());
        browserWindow.on("moved", () => windowBoundsMemory.saveWindowBounds(browserWindow));
        browserWindow.on("resized", () => windowBoundsMemory.saveWindowBounds(browserWindow));
    }

    private static registerEvents(
        browserWindow: BrowserWindow,
        app: App,
        eventSubscriber: EventSubscriber,
        windowBoundsMemory: WindowBoundsMemory,
        settingsManager: SettingsManager,
    ) {
        eventSubscriber.subscribe("hotkeyPressed", () => {
            toggleBrowserWindow({
                app,
                browserWindow,
                defaultSize: defaultWindowSize,
                alwaysCenter: settingsManager.getValue("window.alwaysCenter", false),
                bounds: windowBoundsMemory.getBoundsNearestToCursor(),
            });
        });

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
        environmentVariableProvider: EnvironmentVariableProvider,
    ) {
        await (environmentVariableProvider.get("VITE_DEV_SERVER_URL")
            ? browserWindow.loadURL(environmentVariableProvider.get("VITE_DEV_SERVER_URL"))
            : browserWindow.loadFile(join(__dirname, "..", "dist-renderer", "index.html")));
    }
}
