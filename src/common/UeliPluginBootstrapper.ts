import type { PluginDependencies } from "./PluginDependencies";
import type { UeliPlugin } from "./UeliPlugin";

export interface UeliPluginBootstrapper {
    bootstrap(pluginDependencies: PluginDependencies): UeliPlugin;
}
