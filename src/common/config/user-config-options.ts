import { ApplicationSearchOptions } from "../../main/plugins/application-search-plugin/application-search-options";
import { GeneralOptions } from "./general-options";
import { SearchEngineOptions } from "./search-engine-options";
import { AppearanceOptions } from "./appearance-options";

export interface UserConfigOptions {
    appearanceOptions: AppearanceOptions;
    applicationSearchOptions: ApplicationSearchOptions;
    searchEngineOptions: SearchEngineOptions;
    generalOptions: GeneralOptions;
}
