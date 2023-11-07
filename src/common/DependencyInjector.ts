import type { DependencyName } from "./DependencyName";

export interface DependencyInjector {
    registerInstance<T>(name: DependencyName, instance: T): void;
    getInstance<T>(name: DependencyName): T;
}
