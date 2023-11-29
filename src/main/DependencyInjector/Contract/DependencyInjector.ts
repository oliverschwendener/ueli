import type { UeliPlugin } from "../../Plugins";
import type { DependencyName } from "../DependencyName";

export interface DependencyInjector {
    registerPlugin(plugin: UeliPlugin): void;
    getAllPlugins(): UeliPlugin[];
    registerInstance<T>(name: DependencyName, instance: T): void;
    getInstance<T>(name: DependencyName): T;
}
