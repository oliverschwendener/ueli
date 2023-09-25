import type { OperatingSystem } from "@common/OperatingSystem";
import type { UeliPlugin } from "@common/UeliPlugin";
import type { IpcMain } from "electron";
import type { PluginDependencies } from "../Plugins";
import type { SettingsManager } from "../Settings";
import { PluginManager } from "./PluginManager";

export const usePluginManager = ({
    ipcMain,
    currentOperatingSystem,
    pluginDependencies,
    pluginIdsEnabledByDefault,
    plugins,
    settingsManager,
}: {
    ipcMain: IpcMain;
    currentOperatingSystem: OperatingSystem;
    pluginDependencies: PluginDependencies;
    pluginIdsEnabledByDefault: string[];
    plugins: UeliPlugin[];
    settingsManager: SettingsManager;
}) => {
    const pluginManager = new PluginManager(
        plugins,
        pluginIdsEnabledByDefault,
        currentOperatingSystem,
        settingsManager,
        ipcMain,
    );

    pluginManager.setPluginDependencies(pluginDependencies);
    pluginManager.subscribeToEvents();
    pluginManager.addSearchResultItemsToSearchIndex();

    return pluginManager;
};
