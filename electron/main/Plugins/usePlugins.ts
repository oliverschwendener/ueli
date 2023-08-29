import type { OperatingSystem } from "@common/OperatingSystem";
import type { PluginDependencyInjector } from "../PluginDependencyInjector/PluginDependencyInjector";
import { MacOsApplicationSearch } from "./MacOsApplicationSearch";
import type { Plugin } from "./Plugin";
import { WindowsApplicationSearch } from "./WindowsApplicationSearch/WindowsApplicationSearch";

export const usePlugins = (pluginDependencyInjector: PluginDependencyInjector): Plugin[] => {
    const pluginMap: Record<OperatingSystem, Plugin[]> = {
        macOS: [new MacOsApplicationSearch(pluginDependencyInjector)],
        Windows: [new WindowsApplicationSearch(pluginDependencyInjector)],
    };

    return pluginMap[pluginDependencyInjector.operatingSystem];
};
