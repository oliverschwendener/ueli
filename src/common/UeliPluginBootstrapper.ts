import type { DependencyInjector } from "./DependencyInjector";
import type { UeliPlugin } from "./UeliPlugin";

export interface UeliPluginBootstrapper {
    bootstrap(dependencyInjector: DependencyInjector): UeliPlugin;
}
