import type { OperatingSystem } from "@common/OperatingSystem";
import { MacOsApplicationSearch } from "./MacOsApplicationSearch";
import type { Plugin } from "./Plugin";
import type { PluginDependencies } from "./PluginDependencies";
import { WindowsApplicationSearch } from "./WindowsApplicationSearch/WindowsApplicationSearch";

export const usePlugins = (dependencies: PluginDependencies): Plugin[] => {
    const pluginMap: Record<OperatingSystem, Plugin[]> = {
        macOS: [new MacOsApplicationSearch(dependencies)],
        Windows: [new WindowsApplicationSearch(dependencies)],
    };

    return pluginMap[dependencies.operatingSystem];
};
