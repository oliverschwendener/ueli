import { SearchResultItem } from "../common/search-result-item";
import { PluginType } from "./plugin-type";

export interface SearchPlugin {
    pluginType: PluginType;
    getAll(): Promise<SearchResultItem[]>;
    execute(searchResultItem: SearchResultItem): Promise<void>;
    refreshIndex(): Promise<void>;
    clearCache(): Promise<void>;
}
