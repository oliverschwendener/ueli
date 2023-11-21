import type { DependencyInjector } from "@common/DependencyInjector";
import type { OperatingSystem } from "@common/OperatingSystem";
import type { SearchIndex } from "@common/SearchIndex";
import type { SettingsManager } from "@common/SettingsManager";
import type { IpcMain } from "electron";
import {
    addSearchResultItemsToSearchIndex,
    getEnabledPlugins,
    getSupportedPlugins,
    subscribeToIpcMainEvents,
} from "./Helpers";

export class PluginManagerModule {
    public static bootstrap(dependencyInjector: DependencyInjector) {
        const currentOperatingSystem = dependencyInjector.getInstance<OperatingSystem>("OperatingSystem");
        const settingsManager = dependencyInjector.getInstance<SettingsManager>("SettingsManager");
        const ipcMain = dependencyInjector.getInstance<IpcMain>("IpcMain");
        const searchIndex = dependencyInjector.getInstance<SearchIndex>("SearchIndex");

        const plugins = dependencyInjector.getAllPlugins();
        const supportedPlugins = getSupportedPlugins(plugins, currentOperatingSystem);
        const enabledPlugins = getEnabledPlugins(supportedPlugins, settingsManager, ["ApplicationSearch"]);

        subscribeToIpcMainEvents({
            ipcMain,
            plugins: supportedPlugins,
            searchIndex,
        });

        addSearchResultItemsToSearchIndex({
            plugins: enabledPlugins,
            searchIndex,
        });
    }
}
