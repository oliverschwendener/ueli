import { UserConfigOptions } from "./user-config-options";
import { defaultApplicationSearchOptions } from "../../main/plugins/application-search-plugin/default-application-search-plugin-options";
import { defaultGeneralOptions } from "./default-general-options";
import { defaultSearchEngineOptions } from "./default-search-engine-options";
import { defaultAppearanceOptions } from "./default-appearance-options";

export const defaultUserConfigOptions: UserConfigOptions = {
    appearanceOptions: defaultAppearanceOptions,
    applicationSearchOptions: defaultApplicationSearchOptions,
    generalOptions: defaultGeneralOptions,
    searchEngineOptions: defaultSearchEngineOptions,
};
