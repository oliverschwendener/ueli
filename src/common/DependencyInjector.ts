import type { DependencyName } from "./DependencyName";
import type { UeliPlugin } from "./UeliPlugin";

export interface DependencyInjector {
    registerPlugin(plugin: UeliPlugin): void;
    getAllPlugins(): UeliPlugin[];
    registerInstance<T>(name: DependencyName, instance: T): void;
    getInstance<T>(name: DependencyName): T;
}
