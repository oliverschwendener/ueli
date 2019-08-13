import { PluginType } from "./plugin-type";
import { SearchResultItem } from "../common/search-result-item";
import { UserConfigOptions } from "../common/config/user-config-options";
import { TranslationSet } from "../common/translation/translation-set";

export interface UeliPlugin {
    pluginType: PluginType;
    isEnabled(): boolean;
    execute(searchResultItem: SearchResultItem, privileged: boolean): Promise<void>;
    updateConfig(updatedConfig: UserConfigOptions, translationSet: TranslationSet): Promise<void>;
}
