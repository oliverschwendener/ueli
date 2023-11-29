import type { Extension } from "../../Extension";
import type { DependencyName } from "../DependencyName";

export interface DependencyInjector {
    registerExtension(extension: Extension): void;
    getAllExtensions(): Extension[];
    registerInstance<T>(name: DependencyName, instance: T): void;
    getInstance<T>(name: DependencyName): T;
}
