import type { SettingsManager } from "@common/SettingsManager";
import type { App, IpcMain } from "electron";
import { join } from "path";
import { RealSettingsManager } from "./RealSettingsManager";
import { SettingsFileReader } from "./SettingsFileReader";
import { SettingsFileWriter } from "./SettingsFileWriter";

export const useSettingsManager = ({ app, ipcMain }: { app: App; ipcMain: IpcMain }): SettingsManager => {
    const settingsFilePath = join(app.getPath("userData"), "ueli9.settings.json");

    const settingsManager = new RealSettingsManager(
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
