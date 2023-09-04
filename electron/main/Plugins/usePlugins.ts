import { ApplicationSearchPlugin } from "./ApplicationSearch/ApplicationSearchPlugin";
import type { Plugin } from "./Plugin";
import type { PluginDependencies } from "./PluginDependencies";

export const usePlugins = (pluginDependencies: PluginDependencies): Plugin[] => {
    const { operatingSystem } = pluginDependencies;

    return [new ApplicationSearchPlugin(pluginDependencies)].filter((plugin) =>
        plugin.getSupportedOperatingSystems().includes(operatingSystem),
    );
};
