import type { Dependencies } from "@Core/Dependencies";
import type { DependencyRegistry } from "@Core/DependencyRegistry";
import type { EnvironmentVariableProvider } from "@Core/EnvironmentVariableProvider";
import type { EventSubscriber } from "@Core/EventSubscriber";
import type { SettingsManager } from "@Core/SettingsManager";
import type { UeliCommand, UeliCommandInvokedEvent } from "@Core/UeliCommand";
import type { OperatingSystem, SearchResultItemAction } from "@common/Core";
import { type App, BrowserWindow, type IpcMain } from "electron";
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
} from "./BrowserWindowConstructorOptionsProvider";
import { BrowserWindowToggler } from "./BrowserWindowToggler";

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

        const searchWindow = new BrowserWindow(browserWindowConstructorOptionsProviders[operatingSystem].get());
        searchWindow.setVisibleOnAllWorkspaces(settingsManager.getValue("window.visibleOnAllWorkspaces", false));
        eventEmitter.emitEvent("browserWindowCreated", { id: "search", browserWindow: searchWindow });

        const browserWindowToggler = new BrowserWindowToggler(operatingSystem, app, searchWindow);

        nativeTheme.on("updated", () => searchWindow.setIcon(appIconFilePathResolver.getAppIconFilePath()));

        BrowserWindowModule.registerBrowserWindowEventListeners(
            browserWindowToggler,
            searchWindow,
            dependencyRegistry.get("SettingsManager"),
        );

        BrowserWindowModule.registerEvents(
            searchWindow,
            dependencyRegistry.get("EventSubscriber"),
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

        await BrowserWindowModule.loadFileOrUrl(
            app,
            searchWindow,
            dependencyRegistry.get("EnvironmentVariableProvider"),
            "search.html",
        );

        ipcMain.on("openSettings", () => {
            console.log("open settings window", { pathname: "/settings/general" });
        });
    }

    private static registerBrowserWindowEventListeners(
        browserWindowToggler: BrowserWindowToggler,
        browserWindow: BrowserWindow,
        settingsManager: SettingsManager,
    ) {
        const shouldHideWindowOnBlur = () =>
            settingsManager
                .getValue("window.hideWindowOn", BrowserWindowModule.DefaultHideWindowOnOptions)
                .includes("blur");

        browserWindow.on("blur", () => shouldHideWindowOnBlur() && browserWindowToggler.hide());
    }

    private static registerEvents(
        browserWindow: BrowserWindow,
        eventSubscriber: EventSubscriber,
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

        eventSubscriber.subscribe("actionInvoked", ({ action }: { action: SearchResultItemAction }) => {
            if (shouldHideWindowAfterInvocation(action)) {
                browserWindowToggler.hide();
            }
        });

        eventSubscriber.subscribe("hotkeyPressed", () => browserWindowToggler.toggle());

        eventSubscriber.subscribe("settingUpdated", ({ key, value }: { key: string; value: unknown }) => {
            browserWindow.webContents.send(`settingUpdated[${key}]`, { value });
        });

        eventSubscriber.subscribe("settingUpdated[window.alwaysOnTop]", ({ value }: { value: boolean }) => {
            browserWindow.setAlwaysOnTop(value);
        });

        eventSubscriber.subscribe("settingUpdated[window.backgroundMaterial]", () => {
            const backgroundMaterial = backgroundMaterialProvider.get();

            if (backgroundMaterial) {
                browserWindow.setBackgroundMaterial(backgroundMaterial);
            }
        });

        eventSubscriber.subscribe("settingUpdated[window.vibrancy]", () => {
            browserWindow.setVibrancy(vibrancyProvider.get());
        });

        eventSubscriber.subscribe("settingUpdated[window.visibleOnAllWorkspaces]", ({ value }: { value: boolean }) => {
            browserWindow.setVisibleOnAllWorkspaces(value);
        });

        eventSubscriber.subscribe("navigateTo", (argument) => {
            browserWindowToggler.showAndFocus();
            browserWindow.webContents.send("navigateTo", argument);
        });

        ipcMain.on("escapePressed", () => shouldHideWindowOnEscapePressed() && browserWindowToggler.hide());

        app.on("second-instance", (_, argv) => {
            if (argv.includes("--toggle")) {
                browserWindowToggler.toggle();
            } else {
                browserWindowToggler.showAndFocus();
            }
        });

        BrowserWindowModule.registerUeliCommandEvents(browserWindow, eventSubscriber, browserWindowToggler);
    }

    private static registerUeliCommandEvents(
        browserWindow: BrowserWindow,
        eventSubscriber: EventSubscriber,
        browserWindowToggler: BrowserWindowToggler,
    ) {
        const eventHandlers: { ueliCommands: UeliCommand[]; handler: (argument: unknown) => void }[] = [
            {
                ueliCommands: ["show"],
                handler: (argument) => {
                    browserWindowToggler.showAndFocus();
                    browserWindow.webContents.send("navigateTo", argument);
                },
            },
            {
                ueliCommands: ["openAbout", "openExtensions", "openSettings"],
                handler: (argument) => {
                    console.log("show settings window", argument);
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
        app: App,
        browserWindow: BrowserWindow,
        environmentVariableProvider: EnvironmentVariableProvider,
        fileName: string,
    ) {
        if (app.isPackaged) {
            await browserWindow.loadFile(join(__dirname, "..", "dist-renderer", fileName));
        } else {
            await browserWindow.loadURL(`${environmentVariableProvider.get("VITE_DEV_SERVER_URL")}/${fileName}`);
        }
    }
}
