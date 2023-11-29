import type { IpcMain } from "electron";
import type { DependencyInjector } from "../DependencyInjector";
import type { SettingsReader } from "../SettingsReader";
import type { SettingsWriter } from "../SettingsWriter";
import type { SettingsManager as SettingsManagerInterface } from "./Contract";
import { SettingsManager } from "./SettingsManager";

export class SettingsManagerModule {
    public static bootstrap(dependencyInjector: DependencyInjector) {
        const settingsReader = dependencyInjector.getInstance<SettingsReader>("SettingsReader");
        const settingsWriter = dependencyInjector.getInstance<SettingsWriter>("SettingsWriter");

        dependencyInjector.registerInstance<SettingsManagerInterface>(
            "SettingsManager",
            new SettingsManager(settingsReader, settingsWriter),
        );

        SettingsManagerModule.registerIpcEventListeners(dependencyInjector);
    }

    private static registerIpcEventListeners(dependencyInjector: DependencyInjector): void {
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
