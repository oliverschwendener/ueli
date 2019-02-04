import { ApplicationSearchOptions } from "../../main/plugins/application-search-plugin/application-search-options";
import { GeneralOptions } from "./general-options";
import { SearchEngineOptions } from "./search-engine-options";
import { AppearanceOptions } from "./appearance-options";
import { ShortcutOptions } from "./shortcuts-options";

export interface UserConfigOptions {
    appearanceOptions: AppearanceOptions;
    applicationSearchOptions: ApplicationSearchOptions;
    searchEngineOptions: SearchEngineOptions;
    shortcutOptions: ShortcutOptions;
    generalOptions: GeneralOptions;
}
