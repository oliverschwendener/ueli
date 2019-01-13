import { ApplicationSearchOptions } from "../../main/plugins/application-search-plugin/application-search-options";
import { GeneralOptions } from "./general-options";

export interface UserConfigOptions {
    applicationSearchOptions: ApplicationSearchOptions;
    generalOptions: GeneralOptions;
}
