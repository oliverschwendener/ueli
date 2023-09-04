import type { ExecutionArgument } from "@common/ExecutionArgument";
import type { IpcMain, NativeTheme } from "electron";
import type { UeliPlugin } from "../../../common/UeliPlugin";
import type { EventEmitter } from "../EventEmitter";
import type { Executor } from "../Executor/Executor";
import type { SearchIndex } from "../SearchIndex";
import type { SettingsManager } from "../Settings/SettingsManager";

export const useIpcMain = ({
    eventEmitter,
    executor,
    ipcMain,
    nativeTheme,
    searchIndex,
    settingsManager,
    plugins,
}: {
    eventEmitter: EventEmitter;
    executor: Executor;
    ipcMain: IpcMain;
    nativeTheme: NativeTheme;
    plugins: UeliPlugin[];
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

    ipcMain.on("getPlugins", (event) => {
        event.returnValue = plugins.map(({ id, name, supportedOperatingSystems }) => ({
            id,
            name,
            supportedOperatingSystems,
        }));
    });

    ipcMain.on("pluginEnabled", (_, { pluginId }: { pluginId: string }) =>
        eventEmitter.emitEvent("pluginEnabled", { pluginId }),
    );

    ipcMain.on("pluginDisabled", (_, { pluginId }: { pluginId: string }) =>
        eventEmitter.emitEvent("pluginDisabled", { pluginId }),
    );

    ipcMain.handle("updateSettingByKey", (_, { key, value }: { key: string; value: unknown }) =>
        settingsManager.saveSetting(key, value),
    );

    ipcMain.handle("invokeExecution", (_, executionArgument: ExecutionArgument) => executor.execute(executionArgument));
};
