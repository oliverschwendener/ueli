import type { SettingsManager } from "@common/SettingsManager";
import type { IpcMain } from "electron";

export const useSettingsEventSubscriber = ({
    ipcMain,
    settingsManager,
}: {
    ipcMain: IpcMain;
    settingsManager: SettingsManager;
}) => {
    ipcMain.handle("updateSettingByKey", (_, { key, value }: { key: string; value: unknown }) =>
        settingsManager.saveSetting(key, value),
    );

    ipcMain.on(
        "getSettingByKey",
        (event, { key, defaultValue }: { key: string; defaultValue: unknown }) =>
            (event.returnValue = settingsManager.getSettingByKey(key, defaultValue)),
    );
};
