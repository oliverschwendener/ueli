import type { IpcMain, NativeTheme } from "electron";
import { SearchIndex } from "../SearchIndex";
import { SettingsManager } from "../Settings/SettingsManager";

export const useIpcMain = ({
    ipcMain,
    nativeTheme,
    searchIndex,
    settingsManager,
}: {
    ipcMain: IpcMain;
    nativeTheme: NativeTheme;
    searchIndex: SearchIndex;
    settingsManager: SettingsManager;
}) => {
    ipcMain.on("themeShouldUseDarkColors", (event) => (event.returnValue = nativeTheme.shouldUseDarkColors));
    ipcMain.on("getSearchResultItems", (event) => (event.returnValue = searchIndex.getSearchResultItems()));

    ipcMain.on(
        "getSettingByKey",
        (event, { key, defaultValue }: { key: string; defaultValue: unknown }) =>
            (event.returnValue = settingsManager.getSettingByKey(key, defaultValue)),
    );

    ipcMain.handle("updateSettingByKey", (_, { key, value }: { key: string; value: unknown }) =>
        settingsManager.saveSetting(key, value),
    );
};
