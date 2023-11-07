import type { DependencyInjector } from "@common/DependencyInjector";
import type { SettingsManager as SettingsManagerInterface } from "@common/SettingsManager";
import type { SettingsReader } from "@common/SettingsReader";
import type { SettingsWriter } from "@common/SettingsWriter";
import type { IpcMain } from "electron";
import { SettingsManager } from "./SettingsManager";

export class SettingsManagerModule {
    public static bootstrap(dependencyInjector: DependencyInjector) {
        const settingsReader = dependencyInjector.getInstance<SettingsReader>("SettingsReader");
        const settingsWriter = dependencyInjector.getInstance<SettingsWriter>("SettingsWriter");

        dependencyInjector.registerInstance<SettingsManagerInterface>(
            "SettingsManager",
            new SettingsManager(settingsReader, settingsWriter),
        );

        SettingsManagerModule.registerIpcEvents(dependencyInjector);
    }

    private static registerIpcEvents(dependencyInjector: DependencyInjector): void {
        const settingsManager = dependencyInjector.getInstance<SettingsManager>("SettingsManager");
        const ipcMain = dependencyInjector.getInstance<IpcMain>("IpcMain");

        ipcMain.handle("updateSettingByKey", (_, { key, value }: { key: string; value: unknown }) =>
            settingsManager.saveSetting(key, value),
        );

        ipcMain.on(
            "getSettingByKey",
            (event, { key, defaultValue }: { key: string; defaultValue: unknown }) =>
                (event.returnValue = settingsManager.getSettingByKey(key, defaultValue)),
        );
    }
}
