import type { PluginDependencies } from "@common/PluginDependencies";
import type { UeliPlugin } from "@common/UeliPlugin";

export const setPluginDependencies = (plugins: UeliPlugin[], pluginDependencies: PluginDependencies) => {
    for (const plugin of plugins) {
        plugin.setPluginDependencies(pluginDependencies);
    }
};
