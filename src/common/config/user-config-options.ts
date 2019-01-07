import { ApplicationSearchPluginOptions } from "../../main/plugins/application-search-plugin/application-search-plugin-options";
import { GeneralOptions } from "./general-options";

export interface UserConfigOptions {
    applicationSearchOptions: ApplicationSearchPluginOptions;
    generalOptions: GeneralOptions;
}
