import { UserConfigOptions } from "./user-config-options";
import { defaultApplicationSearchOptions } from "../../main/plugins/application-search-plugin/default-application-search-plugin-options";
import { defaultGeneralOptions } from "./default-general-options";
import { defaultSearchEngineOptions } from "./default-search-engine-options";
import { defaultAppearanceOptions } from "./default-appearance-options";
import { defaultShortcutOptions } from "./default-shortcuts-options";
import { defaultEverythingSearchOptions } from "./default-everything-search-options";
import { defaultMdfindOptions } from "./default-mdfind-options";

export const defaultUserConfigOptions: UserConfigOptions = {
    appearanceOptions: defaultAppearanceOptions,
    applicationSearchOptions: defaultApplicationSearchOptions,
    everythingSearchOptions: defaultEverythingSearchOptions,
    generalOptions: defaultGeneralOptions,
    mdfindOptions: defaultMdfindOptions,
    searchEngineOptions: defaultSearchEngineOptions,
    shortcutOptions: defaultShortcutOptions,
};
