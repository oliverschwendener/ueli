import type { UeliModuleRegistry } from "@Core/ModuleRegistry";
import type { UeliCommandInvokedEvent } from "@Core/UeliCommand";
import type { OperatingSystem, SearchResultItemAction } from "@common/Core";
import { BrowserWindow } from "electron";
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

    public static async bootstrap(moduleRegistry: UeliModuleRegistry) {
        const app = moduleRegistry.get("App");
        const appIconFilePathResolver = moduleRegistry.get("BrowserWindowAppIconFilePathResolver");
        const backgroundMaterialProvider = moduleRegistry.get("BrowserWindowBackgroundMaterialProvider");
        const eventSubscriber = moduleRegistry.get("EventSubscriber");
        const htmlLoader = moduleRegistry.get("BrowserWindowHtmlLoader");
        const ipcMain = moduleRegistry.get("IpcMain");
        const nativeTheme = moduleRegistry.get("NativeTheme");
        const operatingSystem = moduleRegistry.get("OperatingSystem");
        const settingsManager = moduleRegistry.get("SettingsManager");
        const vibrancyProvider = moduleRegistry.get("BrowserWindowVibrancyProvider");
        const browserWindowRegistry = moduleRegistry.get("BrowserWindowRegistry");

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

        searchWindow.on("close", () => browserWindowRegistry.getById("settings")?.close());

        browserWindowRegistry.register("search", searchWindow);

        searchWindow.setVisibleOnAllWorkspaces(settingsManager.getValue("window.visibleOnAllWorkspaces", false));

        if (!import.meta.env.DEV) {
            searchWindow.removeMenu();
        }

        const browserWindowToggler = new BrowserWindowToggler(
            operatingSystem,
            app,
            searchWindow,
            browserWindowRegistry,
        );

        nativeTheme.on("updated", () => searchWindow.setIcon(appIconFilePathResolver.getAppIconFilePath()));

        const settingsWindowIsVisible = () => {
            const settingsWindow = browserWindowRegistry.getById("settings");
            return settingsWindow && !settingsWindow.isDestroyed() && settingsWindow.isVisible();
        };

        const shouldHideWindowOnBlur = () =>
            settingsManager
                .getValue("window.hideWindowOn", SearchWindowModule.DefaultHideWindowOnOptions)
                .includes("blur") && !settingsWindowIsVisible();

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

        eventSubscriber.subscribe("settingsWindowClosed", () => {
            if (searchWindow.isVisible() && !searchWindow.isFocused()) {
                browserWindowToggler.showAndFocus();
            }
        });

        eventSubscriber.subscribe("actionInvocationStarted", ({ action }: { action: SearchResultItemAction }) => {
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

        ipcMain.on("escapePressed", () => shouldHideWindowOnEscapePressed() && browserWindowToggler.hide());

        app.on("second-instance", (_, argv) => {
            if (argv.includes("--toggle")) {
                browserWindowToggler.toggle();
            } else {
                browserWindowToggler.showAndFocus();
            }
        });

        eventSubscriber.subscribe("ueliCommandInvoked", ({ ueliCommand }: UeliCommandInvokedEvent<unknown>) => {
            const map: Record<string, () => void> = {
                show: () => browserWindowToggler.showAndFocus(),
                centerWindow: () => searchWindow.center(),
            };

            if (Object.keys(map).includes(ueliCommand)) {
                map[ueliCommand]();
            }
        });

        await htmlLoader.loadHtmlFile(searchWindow, "search.html");
    }
}
