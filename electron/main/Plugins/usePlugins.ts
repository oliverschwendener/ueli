import type { OperatingSystem } from "@common/OperatingSystem";
import type { App } from "electron";
import type { SearchIndex } from "../SearchIndex";
import type { SettingsManager } from "../Settings/SettingsManager";
import { ensureCacheFolderExists } from "./CacheFolder";
import { MacOsApplicationSearch } from "./MacOsApplicationSearch";
import type { Plugin } from "./Plugin";
import type { PluginDependencies } from "./PluginDependencies";
import { WindowsApplicationSearch } from "./WindowsApplicationSearch/WindowsApplicationSearch";

export const usePlugins = ({
    app,
    operatingSystem,
    searchIndex,
    settingsManager,
}: {
    app: App;
    operatingSystem: OperatingSystem;
    searchIndex: SearchIndex;
    settingsManager: SettingsManager;
}): Plugin[] => {
    const { pluginCacheFolderPath } = ensureCacheFolderExists(app);

    const pluginDependencies: PluginDependencies = {
        app,
        pluginCacheFolderPath,
        searchIndex,
        settingsManager,
    };

    const pluginMap: Record<OperatingSystem, Plugin[]> = {
        macOS: [new MacOsApplicationSearch(pluginDependencies)],
        Windows: [new WindowsApplicationSearch(pluginDependencies)],
    };

    return pluginMap[operatingSystem];
};
