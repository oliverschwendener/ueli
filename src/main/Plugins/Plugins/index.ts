import type { PluginDependencies } from "@common/PluginDependencies";
import type { UeliPlugin } from "@common/UeliPlugin";
import { ApplicationSearchBootstrapper } from "./ApplicationSearch";
import { SystemColorThemeSwitcherBootstrapper } from "./SystemColorThemeSwitcher";

export const getAll = (pluginDependencies: PluginDependencies): UeliPlugin[] => [
    new ApplicationSearchBootstrapper().bootstrap(pluginDependencies),
    new SystemColorThemeSwitcherBootstrapper().bootstrap(pluginDependencies),
];
