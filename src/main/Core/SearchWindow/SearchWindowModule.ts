import type { Dependencies } from "@Core/Dependencies";
import type { DependencyRegistry } from "@Core/DependencyRegistry";
import type { UeliCommand, UeliCommandInvokedEvent } from "@Core/UeliCommand";
import type { OperatingSystem, SearchResultItemAction } from "@common/Core";
import { BrowserWindow } from "electron";
import { NavigateToActionHandler } from "./ActionHandler";
import { AppIconFilePathResolver } from "./AppIconFilePathResolver";
import type { BrowserWindowConstructorOptionsProvider } from "./BrowserWindowConstructorOptionsProvider";
import {
    DefaultBrowserWindowConstructorOptionsProvider,
    LinuxBrowserWindowConstructorOptionsProvider,
    MacOsBrowserWindowConstructorOptionsProvider,
    WindowsBrowserWindowConstructorOptionsProvider,
} from "./BrowserWindowConstructorOptionsProvider";
import { BrowserWindowToggler } from "./BrowserWindowToggler";

export class SearchWindowModule {
    private static readonly DefaultHideWindowOnOptions = ["blur", "afterInvocation", "escapePressed"];

    public static async bootstrap(dependencyRegistry: DependencyRegistry<Dependencies>) {
        const app = dependencyRegistry.get("App");
        const operatingSystem = dependencyRegistry.get("OperatingSystem");
        const settingsManager = dependencyRegistry.get("SettingsManager");
        const eventEmitter = dependencyRegistry.get("EventEmitter");
        const eventSubscriber = dependencyRegistry.get("EventSubscriber");
        const nativeTheme = dependencyRegistry.get("NativeTheme");
        const assetPathResolver = dependencyRegistry.get("AssetPathResolver");
        const ipcMain = dependencyRegistry.get("IpcMain");
        const actionHandlerRegistry = dependencyRegistry.get("ActionHandlerRegistry");
        const vibrancyProvider = dependencyRegistry.get("BrowserWindowVibrancyProvider");
        const backgroundMaterialProvider = dependencyRegistry.get("BrowserWindowBackgroundMaterialProvider");
        const htmlLoader = dependencyRegistry.get("BrowserWindowHtmlLoader");

        const appIconFilePathResolver = new AppIconFilePathResolver(nativeTheme, assetPathResolver, operatingSystem);

        const defaultBrowserWindowOptions = new DefaultBrowserWindowConstructorOptionsProvider(
            app,
            settingsManager,
            appIconFilePathResolver,
        ).get();

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

        const browserWindowToggler = new BrowserWindowToggler(operatingSystem, app, searchWindow);

        nativeTheme.on("updated", () => searchWindow.setIcon(appIconFilePathResolver.getAppIconFilePath()));

        const shouldHideWindowOnBlur = () =>
            settingsManager
                .getValue("window.hideWindowOn", SearchWindowModule.DefaultHideWindowOnOptions)
                .includes("blur");

        searchWindow.on("blur", () => shouldHideWindowOnBlur() && browserWindowToggler.hide());

        const shouldHideWindowAfterInvocation = (action: SearchResultItemAction) =>
            action.hideWindowAfterInvocation &&
            settingsManager
                .getValue("window.hideWindowOn", SearchWindowModule.DefaultHideWindowOnOptions)
                .includes("afterInvocation");

        const shouldHideWindowOnEscapePressed = () =>
            settingsManager
                .getValue("window.hideWindowOn", SearchWindowModule.DefaultHideWindowOnOptions)
                .includes("escapePressed");

        eventSubscriber.subscribe("actionInvoked", ({ action }: { action: SearchResultItemAction }) => {
            if (shouldHideWindowAfterInvocation(action)) {
                browserWindowToggler.hide();
            }
        });

        eventSubscriber.subscribe("hotkeyPressed", () => browserWindowToggler.toggle());

        eventSubscriber.subscribe("settingUpdated", ({ key, value }: { key: string; value: unknown }) => {
            searchWindow.webContents.send(`settingUpdated[${key}]`, { value });
        });

        eventSubscriber.subscribe("settingUpdated[window.alwaysOnTop]", ({ value }: { value: boolean }) => {
            searchWindow.setAlwaysOnTop(value);
        });

        eventSubscriber.subscribe("settingUpdated[window.backgroundMaterial]", () => {
            const backgroundMaterial = backgroundMaterialProvider.get();

            if (backgroundMaterial) {
                searchWindow.setBackgroundMaterial(backgroundMaterial);
            }
        });

        eventSubscriber.subscribe("settingUpdated[window.vibrancy]", () => {
            searchWindow.setVibrancy(vibrancyProvider.get());
        });

        eventSubscriber.subscribe("settingUpdated[window.visibleOnAllWorkspaces]", ({ value }: { value: boolean }) => {
            searchWindow.setVisibleOnAllWorkspaces(value);
        });

        eventSubscriber.subscribe("navigateTo", (argument) => {
            browserWindowToggler.showAndFocus();
            searchWindow.webContents.send("navigateTo", argument);
        });

        ipcMain.on("escapePressed", () => shouldHideWindowOnEscapePressed() && browserWindowToggler.hide());

        app.on("second-instance", (_, argv) => {
            if (argv.includes("--toggle")) {
                browserWindowToggler.toggle();
            } else {
                browserWindowToggler.showAndFocus();
            }
        });

        const eventHandlers: { ueliCommands: UeliCommand[]; handler: (argument: unknown) => void }[] = [
            {
                ueliCommands: ["show"],
                handler: (argument) => {
                    browserWindowToggler.showAndFocus();
                    searchWindow.webContents.send("navigateTo", argument);
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
                handler: () => searchWindow.center(),
            },
        ];

        eventSubscriber.subscribe("ueliCommandInvoked", (event: UeliCommandInvokedEvent<unknown>) => {
            for (const eventHandler of eventHandlers) {
                if (eventHandler.ueliCommands.includes(event.ueliCommand)) {
                    eventHandler.handler(event.argument);
                }
            }
        });

        actionHandlerRegistry.register(new NavigateToActionHandler(eventEmitter));

        await htmlLoader.loadHtmlFile(searchWindow, "search.html");
    }
}
