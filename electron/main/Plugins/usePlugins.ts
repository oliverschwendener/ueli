import type { OperatingSystem } from "@common/OperatingSystem";
import type { PluginDependencies } from "../PluginDependencies/PluginDependencies";
import { MacOsApplicationSearch } from "./MacOsApplicationSearch";
import type { Plugin } from "./Plugin";
import { WindowsApplicationSearch } from "./WindowsApplicationSearch/WindowsApplicationSearch";

export const usePlugins = (pluginDependencies: PluginDependencies): Plugin[] => {
    const pluginMap: Record<OperatingSystem, Plugin[]> = {
        macOS: [new MacOsApplicationSearch(pluginDependencies)],
        Windows: [new WindowsApplicationSearch(pluginDependencies)],
    };

    return pluginMap[pluginDependencies.operatingSystem];
};
