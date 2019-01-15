import { UserConfigOptions } from "./user-config-options";
import { defaultApplicationSearchOptions } from "../../main/plugins/application-search-plugin/default-application-search-plugin-options";
import { defaultGeneralOptions } from "./default-general-options";
import { defaultSearchEngineOptions } from "./default-search-engine-options";

export const defaultUserConfigOptions: UserConfigOptions = {
    applicationSearchOptions: defaultApplicationSearchOptions,
    generalOptions: defaultGeneralOptions,
    searchEngineOptions: defaultSearchEngineOptions,
};
