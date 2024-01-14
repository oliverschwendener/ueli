import type { IpcMain } from "electron";
import type { DependencyInjector } from "../DependencyInjector";
import type { EventEmitter } from "../EventEmitter";
import type { SettingsReader } from "../SettingsReader";
import type { SettingsWriter } from "../SettingsWriter";
import type { SettingsManager as SettingsManagerInterface } from "./Contract";
import { SettingsManager } from "./SettingsManager";

export class SettingsManagerModule {
    public static bootstrap(dependencyInjector: DependencyInjector) {
        const settingsReader = dependencyInjector.getInstance<SettingsReader>("SettingsReader");
        const settingsWriter = dependencyInjector.getInstance<SettingsWriter>("SettingsWriter");
        const eventEmitter = dependencyInjector.getInstance<EventEmitter>("EventEmitter");

        dependencyInjector.registerInstance<SettingsManagerInterface>(
            "SettingsManager",
            new SettingsManager(settingsReader, settingsWriter, eventEmitter),
        );

        SettingsManagerModule.registerIpcEventListeners(dependencyInjector);
    }

    private static registerIpcEventListeners(dependencyInjector: DependencyInjector): void {
        const settingsManager = dependencyInjector.getInstance<SettingsManagerInterface>("SettingsManager");
        const ipcMain = dependencyInjector.getInstance<IpcMain>("IpcMain");

        ipcMain.handle("updateSettingValue", (_, { key, value }: { key: string; value: unknown }) =>
            settingsManager.updateValue(key, value),
        );

        ipcMain.handle(
            "updateExtensionSettingValue",
            (_, { extensionId, key, value }: { extensionId: string; key: string; value: unknown }) =>
                settingsManager.updateExtensionValue(extensionId, key, value),
        );

        ipcMain.on(
            "getSettingValue",
            (event, { key, defaultValue }: { key: string; defaultValue: unknown }) =>
                (event.returnValue = settingsManager.getValue(key, defaultValue)),
        );
    }
}
