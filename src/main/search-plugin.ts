import { SearchResultItem } from "../common/search-result-item";
import { PluginType } from "./plugin-type";
import { UserConfigOptions } from "../common/config/user-config-options";

export interface SearchPlugin {
    pluginType: PluginType;
    isEnabled(): boolean;
    getAll(): Promise<SearchResultItem[]>;
    execute(searchResultItem: SearchResultItem): Promise<void>;
    refreshIndex(): Promise<void>;
    clearCache(): Promise<void>;
    updateConfig(updatedConfig: UserConfigOptions): Promise<void>;
}
