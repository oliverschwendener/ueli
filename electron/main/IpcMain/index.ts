import type { ExecutionArgument } from "@common/ExecutionArgument";
import type { IpcMain, NativeTheme } from "electron";
import type { UeliPlugin } from "../../../common/UeliPlugin";
import type { Executor } from "../Executor/Executor";
import type { SearchIndex } from "../SearchIndex";
import type { SettingsManager } from "../Settings/SettingsManager";

export const useIpcMain = ({
    executor,
    ipcMain,
    nativeTheme,
    searchIndex,
    settingsManager,
    plugins,
}: {
    executor: Executor;
    ipcMain: IpcMain;
    nativeTheme: NativeTheme;
    searchIndex: SearchIndex;
    settingsManager: SettingsManager;
    plugins: UeliPlugin[];
}) => {
    ipcMain.on("themeShouldUseDarkColors", (event) => (event.returnValue = nativeTheme.shouldUseDarkColors));
    ipcMain.on("getSearchResultItems", (event) => (event.returnValue = searchIndex.getSearchResultItems()));

    ipcMain.on(
        "getSettingByKey",
        (event, { key, defaultValue }: { key: string; defaultValue: unknown }) =>
            (event.returnValue = settingsManager.getSettingByKey(key, defaultValue)),
    );

    ipcMain.on("getPlugins", (event) => {
        event.returnValue = plugins.map(({ id, name }) => ({ id, name }));
    });

    ipcMain.handle("updateSettingByKey", (_, { key, value }: { key: string; value: unknown }) =>
        settingsManager.saveSetting(key, value),
    );

    ipcMain.handle("invokeExecution", (_, executionArgument: ExecutionArgument) => executor.execute(executionArgument));
};
