import type { DependencyInjector } from "@common/DependencyInjector";
import type { SettingsManager } from "@common/SettingsManager";
import type { IpcMain } from "electron";

export class SettingsEventSubscriberModule {
    public static bootstrap(dependencyInjector: DependencyInjector) {
        const ipcMain = dependencyInjector.getInstance<IpcMain>("IpcMain");
        const settingsManager = dependencyInjector.getInstance<SettingsManager>("SettingsManager");

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
