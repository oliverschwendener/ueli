import type { UeliModuleRegistry } from "@Core/ModuleRegistry";
import type { UeliCommandInvokedEvent } from "@Core/UeliCommand";
import { SettingsWindowManager } from "./SettingsWindowManager";

export class SettingsWindowModule {
    public static async bootstrap(moduleRegistry: UeliModuleRegistry) {
        const app = moduleRegistry.get("App");
        const browserWindowAppIconFilePathResolver = moduleRegistry.get("BrowserWindowAppIconFilePathResolver");
        const eventSubscriber = moduleRegistry.get("EventSubscriber");
        const htmlLoader = moduleRegistry.get("BrowserWindowHtmlLoader");
        const ipcMain = moduleRegistry.get("IpcMain");
        const nativeTheme = moduleRegistry.get("NativeTheme");
        const translator = moduleRegistry.get("Translator");
        const browserWindowNotifier = moduleRegistry.get("BrowserWindowNotifier");
        const browserWindowRegistry = moduleRegistry.get("BrowserWindowRegistry");
        const eventEmitter = moduleRegistry.get("EventEmitter");

        const settingsWindowManager = new SettingsWindowManager(
            browserWindowAppIconFilePathResolver,
            translator,
            app,
            browserWindowRegistry,
            eventEmitter,
            htmlLoader,
        );

        ipcMain.on("openSettings", async () => {
            const settingsWindow = await settingsWindowManager.getWindow();
            settingsWindow.focus();
            settingsWindow.show();
        });

        eventSubscriber.subscribe("settingUpdated", async ({ key, value }: { key: string; value: unknown }) => {
            const settingsWindow = await settingsWindowManager.getWindow();
            settingsWindow.webContents.send(`settingUpdated[${key}]`, { value });
        });

        eventSubscriber.subscribe("settingUpdated[general.language]", async () => {
            const settingsWindow = await settingsWindowManager.getWindow();
            settingsWindow.setTitle(settingsWindowManager.getWindowTitle());
        });

        eventSubscriber.subscribe(
            "ueliCommandInvoked",
            async ({ ueliCommand, argument: { pathname } }: UeliCommandInvokedEvent<{ pathname: string }>) => {
                if (["openAbout", "openExtensions", "openSettings"].includes(ueliCommand)) {
                    const settingsWindow = await settingsWindowManager.getWindow();

                    settingsWindow.show();
                    settingsWindow.focus();

                    browserWindowNotifier.notify({
                        browserWindowId: "settings",
                        channel: "navigateTo",
                        data: { pathname },
                    });
                }
            },
        );

        nativeTheme.on("updated", async () => {
            const settingsWindow = await settingsWindowManager.getWindow();
            settingsWindow.setIcon(browserWindowAppIconFilePathResolver.getAppIconFilePath());
        });
    }
}
