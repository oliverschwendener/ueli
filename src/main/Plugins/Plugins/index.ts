import { PluginDependencies } from "@common/PluginDependencies";
import { UeliPlugin } from "@common/UeliPlugin";
import { ApplicationSearch } from "./ApplicationSearch";
import { SystemColorThemeSwitcher } from "./SystemColorThemeSwitcher";

export const getAll = (pluginDependencies: PluginDependencies): UeliPlugin[] => [
    new ApplicationSearch(pluginDependencies),
    new SystemColorThemeSwitcher(pluginDependencies),
];

export const getAllPluginIdsEnabledByDefault = () => ["ApplicationSearch"];
