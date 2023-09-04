import type { UeliPlugin } from "../../../common/UeliPlugin";
import { ApplicationSearchPlugin } from "./ApplicationSearch/ApplicationSearchPlugin";
import type { PluginDependencies } from "./PluginDependencies";

export const usePlugins = (pluginDependencies: PluginDependencies): UeliPlugin[] => {
    const { operatingSystem } = pluginDependencies;

    return [new ApplicationSearchPlugin(pluginDependencies)].filter(({ getSupportedOperatingSystems }) =>
        getSupportedOperatingSystems().includes(operatingSystem),
    );
};
