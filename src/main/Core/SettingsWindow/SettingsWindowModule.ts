import type { Dependencies } from "@Core/Dependencies";
import type { DependencyRegistry } from "@Core/DependencyRegistry";
import type { UeliCommandInvokedEvent } from "@Core/UeliCommand";
import { SettingsWindowManager } from "./SettingsWindowManager";

export class SettingsWindowModule {
    public static async bootstrap(dependencyRegistry: DependencyRegistry<Dependencies>) {
        const app = dependencyRegistry.get("App");
        const browserWindowAppIconFilePathResolver = dependencyRegistry.get("BrowserWindowAppIconFilePathResolver");
        const eventSubscriber = dependencyRegistry.get("EventSubscriber");
        const htmlLoader = dependencyRegistry.get("BrowserWindowHtmlLoader");
        const ipcMain = dependencyRegistry.get("IpcMain");
        const nativeTheme = dependencyRegistry.get("NativeTheme");
        const translator = dependencyRegistry.get("Translator");
        const browserWindowNotifier = dependencyRegistry.get("BrowserWindowNotifier");
        const browserWindowRegistry = dependencyRegistry.get("BrowserWindowRegistry");
        const eventEmitter = dependencyRegistry.get("EventEmitter");

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
