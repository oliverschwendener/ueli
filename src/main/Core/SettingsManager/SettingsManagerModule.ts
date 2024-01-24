import type { Dependencies } from "@Core/Dependencies";
import type { DependencyRegistry } from "@Core/DependencyRegistry";
import { SettingsManager } from "./SettingsManager";

export class SettingsManagerModule {
    public static bootstrap(dependencyRegistry: DependencyRegistry<Dependencies>) {
        const app = dependencyRegistry.get("App");
        const ipcMain = dependencyRegistry.get("IpcMain");
        const settingsReader = dependencyRegistry.get("SettingsReader");
        const settingsWriter = dependencyRegistry.get("SettingsWriter");
        const eventEmitter = dependencyRegistry.get("EventEmitter");
        const safeStorageEncryption = dependencyRegistry.get("SafeStorageEncryption");

        const settingsManager = new SettingsManager(
            settingsReader,
            settingsWriter,
            eventEmitter,
            safeStorageEncryption,
        );

        dependencyRegistry.register("SettingsManager", settingsManager);

        ipcMain.handle(
            "updateSettingValue",
            (_, { key, value, isSensitive }: { key: string; value: unknown; isSensitive?: boolean }) =>
                settingsManager.updateValue(key, value, isSensitive),
        );

        ipcMain.on(
            "getSettingValue",
            (
                event,
                { key, defaultValue, isSensitive }: { key: string; defaultValue: unknown; isSensitive?: boolean },
            ) => (event.returnValue = settingsManager.getValue(key, defaultValue, isSensitive)),
        );

        ipcMain.handle("resetAllSettings", async () => {
            await settingsManager.resetAllSettings();

            // Because it's the easiest way to reset all settings to their default values in all places, we simply
            // restart the app.
            app.relaunch();
            app.exit();
        });
    }
}
