import type { UeliPlugin } from "@common/UeliPlugin";
import type { PluginDependencies } from "./PluginDependencies";

export const setPluginDependencies = (plugins: UeliPlugin[], pluginDependencies: PluginDependencies) => {
    for (const plugin of plugins) {
        plugin.setPluginDependencies(pluginDependencies);
    }
};
