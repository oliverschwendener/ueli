import type { DependencyRegistry } from "..";
import { SettingsManager } from "./SettingsManager";

export class SettingsManagerModule {
    public static bootstrap(dependencyRegistry: DependencyRegistry) {
        const settingsReader = dependencyRegistry.get("SettingsReader");
        const settingsWriter = dependencyRegistry.get("SettingsWriter");
        const eventEmitter = dependencyRegistry.get("EventEmitter");
        const safeStorageEncryption = dependencyRegistry.get("SafeStorageEncryption");

        dependencyRegistry.register(
            "SettingsManager",
            new SettingsManager(settingsReader, settingsWriter, eventEmitter, safeStorageEncryption),
        );

        SettingsManagerModule.registerIpcEventListeners(dependencyRegistry);
    }

    private static registerIpcEventListeners(dependencyRegistry: DependencyRegistry): void {
        const settingsManager = dependencyRegistry.get("SettingsManager");
        const ipcMain = dependencyRegistry.get("IpcMain");

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
    }
}
