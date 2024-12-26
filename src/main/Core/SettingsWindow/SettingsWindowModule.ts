import type { Dependencies } from "@Core/Dependencies";
import type { DependencyRegistry } from "@Core/DependencyRegistry";
import { BrowserWindow } from "electron";
import { join } from "path";

export class SettingsWindowModule {
    public static async bootstrap(dependencyRegistry: DependencyRegistry<Dependencies>) {
        const ipcMain = dependencyRegistry.get("IpcMain");
        const eventSubscriber = dependencyRegistry.get("EventSubscriber");

        const settingsWindow = await this.createSettingsWindow(dependencyRegistry);

        ipcMain.on("openSettings", async () => {
            settingsWindow.focus();
            settingsWindow.show();
        });

        eventSubscriber.subscribe("settingUpdated", ({ key, value }: { key: string; value: unknown }) => {
            settingsWindow.webContents.send(`settingUpdated[${key}]`, { value });
        });
    }

    private static async createSettingsWindow(
        dependencyRegistry: DependencyRegistry<Dependencies>,
    ): Promise<BrowserWindow> {
        const app = dependencyRegistry.get("App");
        const environmentVariableProvider = dependencyRegistry.get("EnvironmentVariableProvider");

        const settingsWindow = new BrowserWindow({
            show: false,
            autoHideMenuBar: true,
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

        if (app.isPackaged) {
            await settingsWindow.loadFile(join(__dirname, "..", "dist-renderer", "settings.html"));
        } else {
            await settingsWindow.loadURL(
                `${environmentVariableProvider.get("VITE_DEV_SERVER_URL")}/${"settings.html"}`,
            );
        }

        return settingsWindow;
    }
}
