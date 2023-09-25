import type { OperatingSystem } from "@common/OperatingSystem";
import type { UeliPlugin } from "@common/UeliPlugin";
import type { IpcMain } from "electron";
import type { PluginDependencies } from "../Plugins";
import type { SettingsManager } from "../Settings";
import { PluginManager } from "./PluginManager";

export const usePluginManager = ({
    ipcMain,
    operatingSystem,
    pluginDependencies,
    pluginIdsEnabledByDefault,
    plugins,
    settingsManager,
}: {
    ipcMain: IpcMain;
    operatingSystem: OperatingSystem;
    pluginDependencies: PluginDependencies;
    pluginIdsEnabledByDefault: string[];
    plugins: UeliPlugin[];
    settingsManager: SettingsManager;
}) => {
    const pluginManager = new PluginManager(
        plugins,
        pluginIdsEnabledByDefault,
        operatingSystem,
        settingsManager,
        ipcMain,
    );

    pluginManager.setPluginDependencies(pluginDependencies);
    pluginManager.subscribeToEvents();
    pluginManager.addSearchResultItemsToSearchIndex();

    return pluginManager;
};
