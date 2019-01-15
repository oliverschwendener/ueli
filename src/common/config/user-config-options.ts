import { ApplicationSearchOptions } from "../../main/plugins/application-search-plugin/application-search-options";
import { GeneralOptions } from "./general-options";
import { SearchEngineOptions } from "./search-engine-options";

export interface UserConfigOptions {
    applicationSearchOptions: ApplicationSearchOptions;
    searchEngineOptions: SearchEngineOptions;
    generalOptions: GeneralOptions;
}
