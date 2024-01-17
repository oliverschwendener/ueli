import type { DependencyInjector } from "..";
import { SettingsManager } from "./SettingsManager";

export class SettingsManagerModule {
    public static bootstrap(dependencyInjector: DependencyInjector) {
        const settingsReader = dependencyInjector.getInstance("SettingsReader");
        const settingsWriter = dependencyInjector.getInstance("SettingsWriter");
        const eventEmitter = dependencyInjector.getInstance("EventEmitter");
        const safeStorageEncryption = dependencyInjector.getInstance("SafeStorageEncryption");

        dependencyInjector.registerInstance(
            "SettingsManager",
            new SettingsManager(settingsReader, settingsWriter, eventEmitter, safeStorageEncryption),
        );

        SettingsManagerModule.registerIpcEventListeners(dependencyInjector);
    }

    private static registerIpcEventListeners(dependencyInjector: DependencyInjector): void {
        const settingsManager = dependencyInjector.getInstance("SettingsManager");
        const ipcMain = dependencyInjector.getInstance("IpcMain");

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
