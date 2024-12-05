import type { Dependencies } from "@Core/Dependencies";
import type { DependencyRegistry } from "@Core/DependencyRegistry";
import type { EnvironmentVariableProvider } from "@Core/EnvironmentVariableProvider";
import type { EventSubscriber } from "@Core/EventSubscriber";
import type { SettingsManager } from "@Core/SettingsManager";
import type { UeliCommand, UeliCommandInvokedEvent } from "@Core/UeliCommand";
import type { OperatingSystem, SearchResultItemAction } from "@common/Core";
import type { App, BrowserWindow, IpcMain } from "electron";
import { join } from "path";
import { NavigateToActionHandler } from "./ActionHandler";
import { AppIconFilePathResolver } from "./AppIconFilePathResolver";
import type { BrowserWindowConstructorOptionsProvider } from "./BrowserWindowConstructorOptionsProvider";
import {
    BackgroundMaterialProvider,
    DefaultBrowserWindowConstructorOptionsProvider,
    LinuxBrowserWindowConstructorOptionsProvider,
    MacOsBrowserWindowConstructorOptionsProvider,
    VibrancyProvider,
    WindowsBrowserWindowConstructorOptionsProvider,
    defaultWindowSize,
} from "./BrowserWindowConstructorOptionsProvider";
import { BrowserWindowCreator } from "./BrowserWindowCreator";
import { BrowserWindowToggler } from "./BrowserWindowToggler";
import { WindowBoundsMemory } from "./WindowBoundsMemory";
import { sendToBrowserWindow } from "./sendToBrowserWindow";

export class BrowserWindowModule {
    private static readonly DefaultHideWindowOnOptions = ["blur", "afterInvocation", "escapePressed"];

    public static async bootstrap(dependencyRegistry: DependencyRegistry<Dependencies>) {
        const app = dependencyRegistry.get("App");
        const operatingSystem = dependencyRegistry.get("OperatingSystem");
        const settingsManager = dependencyRegistry.get("SettingsManager");
        const eventEmitter = dependencyRegistry.get("EventEmitter");
        const nativeTheme = dependencyRegistry.get("NativeTheme");
        const assetPathResolver = dependencyRegistry.get("AssetPathResolver");
        const ipcMain = dependencyRegistry.get("IpcMain");

        const windowBoundsMemory = new WindowBoundsMemory(dependencyRegistry.get("Screen"), {});

        const appIconFilePathResolver = new AppIconFilePathResolver(nativeTheme, assetPathResolver, operatingSystem);

        const defaultBrowserWindowOptions = new DefaultBrowserWindowConstructorOptionsProvider(
            app,
            settingsManager,
            appIconFilePathResolver,
        ).get();

        const vibrancyProvider = new VibrancyProvider(settingsManager);
        const backgroundMaterialProvider = new BackgroundMaterialProvider(settingsManager);

        const browserWindowConstructorOptionsProviders: Record<
            OperatingSystem,
            BrowserWindowConstructorOptionsProvider
        > = {
            Linux: new LinuxBrowserWindowConstructorOptionsProvider(defaultBrowserWindowOptions),
            macOS: new MacOsBrowserWindowConstructorOptionsProvider(defaultBrowserWindowOptions, vibrancyProvider),
            Windows: new WindowsBrowserWindowConstructorOptionsProvider(
                defaultBrowserWindowOptions,
                backgroundMaterialProvider,
            ),
        };

        const browserWindow = new BrowserWindowCreator(
            browserWindowConstructorOptionsProviders[operatingSystem],
        ).create();

        browserWindow.setVisibleOnAllWorkspaces(settingsManager.getValue("window.visibleOnAllWorkspaces", false));

        const browserWindowToggler = new BrowserWindowToggler(
            operatingSystem,
            app,
            browserWindow,
            defaultWindowSize,
            settingsManager,
        );

        eventEmitter.emitEvent("browserWindowCreated", { browserWindow });

        nativeTheme.addListener("updated", () => browserWindow.setIcon(appIconFilePathResolver.getAppIconFilePath()));

        BrowserWindowModule.registerBrowserWindowEventListeners(
            browserWindowToggler,
            browserWindow,
            dependencyRegistry.get("SettingsManager"),
            windowBoundsMemory,
        );

        BrowserWindowModule.registerEvents(
            browserWindow,
            dependencyRegistry.get("EventSubscriber"),
            windowBoundsMemory,
            vibrancyProvider,
            backgroundMaterialProvider,
            browserWindowToggler,
            settingsManager,
            ipcMain,
            app,
        );

        dependencyRegistry
            .get("ActionHandlerRegistry")
            .register(new NavigateToActionHandler(dependencyRegistry.get("EventEmitter")));

        await BrowserWindowModule.loadFileOrUrl(browserWindow, dependencyRegistry.get("EnvironmentVariableProvider"));
    }

    private static registerBrowserWindowEventListeners(
        browserWindowToggler: BrowserWindowToggler,
        browserWindow: BrowserWindow,
        settingsManager: SettingsManager,
        windowBoundsMemory: WindowBoundsMemory,
    ) {
        const shouldHideWindowOnBlur = () =>
            settingsManager
                .getValue("window.hideWindowOn", BrowserWindowModule.DefaultHideWindowOnOptions)
                .includes("blur");

        browserWindow.on("blur", () => shouldHideWindowOnBlur() && browserWindowToggler.hide());
        browserWindow.on("moved", () => windowBoundsMemory.saveWindowBounds(browserWindow));
        browserWindow.on("resized", () => windowBoundsMemory.saveWindowBounds(browserWindow));
    }

    private static registerEvents(
        browserWindow: BrowserWindow,
        eventSubscriber: EventSubscriber,
        windowBoundsMemory: WindowBoundsMemory,
        vibrancyProvider: VibrancyProvider,
        backgroundMaterialProvider: BackgroundMaterialProvider,
        browserWindowToggler: BrowserWindowToggler,
        settingsManager: SettingsManager,
        ipcMain: IpcMain,
        app: App,
    ) {
        const shouldHideWindowAfterInvocation = (action: SearchResultItemAction) =>
            action.hideWindowAfterInvocation &&
            settingsManager
                .getValue("window.hideWindowOn", BrowserWindowModule.DefaultHideWindowOnOptions)
                .includes("afterInvocation");

        const shouldHideWindowOnEscapePressed = () =>
            settingsManager
                .getValue("window.hideWindowOn", BrowserWindowModule.DefaultHideWindowOnOptions)
                .includes("escapePressed");

        eventSubscriber.subscribe(
            "actionInvoked",
            ({ action }: { action: SearchResultItemAction }) =>
                shouldHideWindowAfterInvocation(action) && browserWindowToggler.hide(),
        );

        eventSubscriber.subscribe("hotkeyPressed", () =>
            browserWindowToggler.toggle(windowBoundsMemory.getBoundsNearestToCursor()),
        );

        eventSubscriber.subscribe("settingUpdated", ({ key, value }: { key: string; value: unknown }) => {
            sendToBrowserWindow(browserWindow, `settingUpdated[${key}]`, { value });
        });

        eventSubscriber.subscribe("settingUpdated[window.alwaysOnTop]", ({ value }: { value: boolean }) => {
            browserWindow.setAlwaysOnTop(value);
        });

        eventSubscriber.subscribe("settingUpdated[window.backgroundMaterial]", () => {
            browserWindow.setBackgroundMaterial(backgroundMaterialProvider.get());
        });

        eventSubscriber.subscribe("settingUpdated[window.vibrancy]", () => {
            browserWindow.setVibrancy(vibrancyProvider.get());
        });

        eventSubscriber.subscribe("settingUpdated[window.visibleOnAllWorkspaces]", ({ value }: { value: boolean }) => {
            browserWindow.setVisibleOnAllWorkspaces(value);
        });

        eventSubscriber.subscribe("navigateTo", ({ pathname }: { pathname: string }) => {
            browserWindowToggler.showAndFocus();
            sendToBrowserWindow(browserWindow, "navigateTo", { pathname });
        });

        ipcMain.on("escapePressed", () => shouldHideWindowOnEscapePressed() && browserWindowToggler.hide());

        app.on("second-instance", () => browserWindowToggler.toggle(windowBoundsMemory.getBoundsNearestToCursor()));

        BrowserWindowModule.registerUeliCommandEvents(browserWindow, eventSubscriber, browserWindowToggler);
    }

    private static registerUeliCommandEvents(
        browserWindow: BrowserWindow,
        eventSubscriber: EventSubscriber,
        browserWindowToggler: BrowserWindowToggler,
    ) {
        const eventHandlers: { ueliCommands: UeliCommand[]; handler: (argument: unknown) => void }[] = [
            {
                ueliCommands: ["openAbout", "openExtensions", "openSettings", "show"],
                handler: ({ pathname }: { pathname: string }) => {
                    browserWindowToggler.showAndFocus();
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
