import type { PluginDependencies } from "@common/PluginDependencies";
import type { IpcMain } from "electron";
import {
    addSearchResultItemsToSearchIndex,
    getEnabledPlugins,
    getSupportedPlugins,
    setPluginDependencies,
    subscribeToIpcMainEvents,
} from "./Helpers";
import { pluginIdsEnabledByDefault, plugins } from "./Plugins";

export const usePlugins = ({
    ipcMain,
    pluginDependencies,
}: {
    ipcMain: IpcMain;
    pluginDependencies: PluginDependencies;
}) => {
    const { currentOperatingSystem, settingsManager } = pluginDependencies;

    const supportedPlugins = getSupportedPlugins(plugins, currentOperatingSystem);
    const enabledPlugins = getEnabledPlugins(supportedPlugins, settingsManager, pluginIdsEnabledByDefault);

    setPluginDependencies(plugins, pluginDependencies);
    subscribeToIpcMainEvents(ipcMain, supportedPlugins);
    addSearchResultItemsToSearchIndex(enabledPlugins);
};
