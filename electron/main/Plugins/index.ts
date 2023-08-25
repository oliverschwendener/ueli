import { OperatingSystem } from "@common/OperatingSystem";
import { SearchIndex } from "../SearchIndex";
import { MacOsApplicationSearch } from "./MacOsApplicationSearch";
import { Plugin } from "./Plugin";

export const usePlugins = (operatingSystem: OperatingSystem, searchIndex: SearchIndex) => {
    const plugins: Plugin[] = [new MacOsApplicationSearch(searchIndex)];

    return { plugins };
};
