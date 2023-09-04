import { MacOsApplicationSearch } from "./MacOsApplicationSearch";
import type { Plugin } from "./Plugin";
import type { PluginDependencies } from "./PluginDependencies";
import { WindowsApplicationSearch } from "./WindowsApplicationSearch/WindowsApplicationSearch";

export const usePlugins = (pluginDependencies: PluginDependencies): Plugin[] => {
    const { operatingSystem } = pluginDependencies;

    const plugins: Plugin[] = [
        new MacOsApplicationSearch(pluginDependencies),
        new WindowsApplicationSearch(pluginDependencies),
    ];

    return plugins.filter((plugin) => plugin.getSupportedOperatingSystems().includes(operatingSystem));
};
