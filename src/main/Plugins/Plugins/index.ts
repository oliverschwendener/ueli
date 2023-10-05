import { PluginDependencies } from "@common/PluginDependencies";
import { UeliPlugin } from "@common/UeliPlugin";
import { ApplicationSearchPlugin } from "./ApplicationSearch";
import { SystemColorThemeSwitcher } from "./SystemColorThemeSwitcher";

export const getAll = (pluginDependencies: PluginDependencies): UeliPlugin[] => [
    new ApplicationSearchPlugin(pluginDependencies),
    new SystemColorThemeSwitcher(pluginDependencies),
];

export const getAllPluginIdsEnabledByDefault = () => ["ApplicationSearch"];
