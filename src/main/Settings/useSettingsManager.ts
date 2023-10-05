import type { App, IpcMain } from "electron";
import { join } from "path";
import { SettingsFileReader } from "./SettingsFileReader";
import { SettingsFileWriter } from "./SettingsFileWriter";
import { SettingsManager } from "./SettingsManager";

export const useSettingsManager = ({ app, ipcMain }: { app: App; ipcMain: IpcMain }): SettingsManager => {
    const settingsFilePath = join(app.getPath("userData"), "ueli9.settings.json");

    const settingsManager = new SettingsManager(
        new SettingsFileReader(settingsFilePath),
        new SettingsFileWriter(settingsFilePath),
    );

    ipcMain.handle("updateSettingByKey", (_, { key, value }: { key: string; value: unknown }) =>
        settingsManager.saveSetting(key, value),
    );

    ipcMain.on(
        "getSettingByKey",
        (event, { key, defaultValue }: { key: string; defaultValue: unknown }) =>
            (event.returnValue = settingsManager.getSettingByKey(key, defaultValue)),
    );

    return settingsManager;
};
