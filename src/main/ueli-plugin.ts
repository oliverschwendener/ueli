import { PluginType } from "./plugin-type";
import { SearchResultItem } from "../common/search-result-item";
import { UserConfigOptions } from "../common/config/user-config-options";
import { TranslationSet } from "../common/translation/translation-set";
import { AutoCompletionResult } from "../common/auto-completion-result";

export interface UeliPlugin {
    pluginType: PluginType;
    openLocationSupported: boolean;
    autoCompletionSupported: boolean;
    isEnabled(): boolean;
    execute(searchResultItem: SearchResultItem, privileged: boolean): Promise<void>;
    openLocation(searchResultItem: SearchResultItem): Promise<void>;
    autoComplete(searchResultItem: SearchResultItem): Promise<AutoCompletionResult>;
    updateConfig(updatedConfig: UserConfigOptions, translationSet: TranslationSet): Promise<void>;
}
