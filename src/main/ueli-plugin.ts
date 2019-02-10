import { PluginType } from "./plugin-type";
import { SearchResultItem } from "../common/search-result-item";
import { UserConfigOptions } from "../common/config/user-config-options";

export interface UeliPlugin {
    pluginType: PluginType;
    isEnabled(): boolean;
    execute(searchResultItem: SearchResultItem): Promise<void>;
    updateConfig(updatedConfig: UserConfigOptions): Promise<void>;
}
