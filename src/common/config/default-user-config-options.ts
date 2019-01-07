import { UserConfigOptions } from "./user-config-options";
import { defaultApplicationSearchPluginOptions } from "../../main/plugins/application-search-plugin/default-application-search-plugin-options";
import { defaultGeneralOptions } from "./default-general-options";

export const defaultUserConfigOptions: UserConfigOptions = {
    applicationSearchOptions: defaultApplicationSearchPluginOptions,
    generalOptions: defaultGeneralOptions,
};
