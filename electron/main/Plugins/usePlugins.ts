import { OperatingSystem } from "@common/OperatingSystem";
import { SearchIndex } from "../SearchIndex";
import { MacOsApplicationSearch } from "./MacOsApplicationSearch";
import { Plugin } from "./Plugin";

export const usePlugins = (operatingSystem: OperatingSystem, searchIndex: SearchIndex) => {
    const pluginMap: Record<OperatingSystem, Plugin[]> = {
        macOS: [new MacOsApplicationSearch(searchIndex)],
        Windows: [],
    };

    const plugins = pluginMap[operatingSystem];

    return { plugins };
};
