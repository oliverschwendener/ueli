import { SearchIndex } from "../SearchIndex";
import { MacOsApplicationSearch } from "./MacOsApplicationSearch";
import { Plugin } from "./Plugin";

export const usePlugins = (searchIndex: SearchIndex) => {
    const plugins: Plugin[] = [new MacOsApplicationSearch(searchIndex)];

    return { plugins };
};
