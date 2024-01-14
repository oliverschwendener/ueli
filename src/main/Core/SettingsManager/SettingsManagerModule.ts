import type { IpcMain } from "electron";
import type { DependencyInjector, EventEmitter, SafeStorageEncryption, SettingsReader, SettingsWriter } from "..";
import type { SettingsManager as SettingsManagerInterface } from "./Contract";
import { SettingsManager } from "./SettingsManager";

export class SettingsManagerModule {
    public static bootstrap(dependencyInjector: DependencyInjector) {
        const settingsReader = dependencyInjector.getInstance<SettingsReader>("SettingsReader");
        const settingsWriter = dependencyInjector.getInstance<SettingsWriter>("SettingsWriter");
        const eventEmitter = dependencyInjector.getInstance<EventEmitter>("EventEmitter");
        const safeStorageEncryption = dependencyInjector.getInstance<SafeStorageEncryption>("SafeStorageEncryption");

        dependencyInjector.registerInstance<SettingsManagerInterface>(
            "SettingsManager",
            new SettingsManager(settingsReader, settingsWriter, eventEmitter, safeStorageEncryption),
        );

        SettingsManagerModule.registerIpcEventListeners(dependencyInjector);
    }

    private static registerIpcEventListeners(dependencyInjector: DependencyInjector): void {
        const settingsManager = dependencyInjector.getInstance<SettingsManagerInterface>("SettingsManager");
        const ipcMain = dependencyInjector.getInstance<IpcMain>("IpcMain");

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
