import type { Dependencies } from "@Core/Dependencies";
import type { DependencyRegistry } from "@Core/DependencyRegistry";
import { BrowserWindow } from "electron";
import { join } from "path";

export class SettingsWindowModule {
    public static async bootstrap(dependencyRegistry: DependencyRegistry<Dependencies>) {
        const app = dependencyRegistry.get("App");
        const browserWindowAppIconFilePathResolver = dependencyRegistry.get("BrowserWindowAppIconFilePathResolver");
        const eventSubscriber = dependencyRegistry.get("EventSubscriber");
        const htmlLoader = dependencyRegistry.get("BrowserWindowHtmlLoader");
        const ipcMain = dependencyRegistry.get("IpcMain");
        const nativeTheme = dependencyRegistry.get("NativeTheme");
        const translator = dependencyRegistry.get("Translator");

        const getWindowTitle = () => {
            const { t } = translator.createT({
                "en-US": { settingsWindowTitle: "Settings" },
                "de-CH": { settingsWindowTitle: "Einstellungen" },
            });

            return t("settingsWindowTitle");
        };

        const settingsWindow = new BrowserWindow({
            show: false,
            autoHideMenuBar: true,
            icon: browserWindowAppIconFilePathResolver.getAppIconFilePath(),
            title: getWindowTitle(),
            webPreferences: {
                preload: join(__dirname, "..", "dist-preload", "index.js"),
                spellcheck: false,

                // The dev tools should only be available in development mode. Once the app is packaged, the dev tools
                // should be disabled.
                devTools: !app.isPackaged,

                // The following options are needed for images with `file://` URLs to work during development
                allowRunningInsecureContent: !app.isPackaged,
                webSecurity: app.isPackaged,
            },
        });

        ipcMain.on("openSettings", async () => {
            settingsWindow.focus();
            settingsWindow.show();
        });

        eventSubscriber.subscribe("settingUpdated", ({ key, value }: { key: string; value: unknown }) => {
            settingsWindow.webContents.send(`settingUpdated[${key}]`, { value });
        });

        eventSubscriber.subscribe("settingUpdated[general.language]", () => {
            settingsWindow.setTitle(getWindowTitle());
        });

        nativeTheme.on("updated", () =>
            settingsWindow.setIcon(browserWindowAppIconFilePathResolver.getAppIconFilePath()),
        );

        await htmlLoader.loadHtmlFile(settingsWindow, "settings.html");
    }
}
