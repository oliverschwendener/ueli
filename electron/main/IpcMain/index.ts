import type { ExecutionArgument } from "@common/ExecutionArgument";
import type { IpcMain, NativeTheme } from "electron";
import type { EventEmitter } from "../EventEmitter";
import type { Executor } from "../Executor";
import type { PluginManager } from "../PluginManager";
import type { SearchIndex } from "../SearchIndex";
import type { SettingsManager } from "../Settings";

export const useIpcMain = ({
    eventEmitter,
    executor,
    ipcMain,
    nativeTheme,
    searchIndex,
    settingsManager,
    pluginManager,
}: {
    eventEmitter: EventEmitter;
    executor: Executor;
    ipcMain: IpcMain;
    nativeTheme: NativeTheme;
    pluginManager: PluginManager;
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

    ipcMain.on("getAllPlugins", (event) => {
        event.returnValue = pluginManager
            .getSupportedPlugins()
            .map(({ id, name, nameTranslationKey, supportedOperatingSystems }) => ({
                id,
                name,
                nameTranslationKey,
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
