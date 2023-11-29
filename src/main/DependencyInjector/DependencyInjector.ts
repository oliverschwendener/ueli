import type { Extension } from "../Extension";
import type { DependencyInjector as DependencyInjectorInterface } from "./Contract";
import type { DependencyName } from "./DependencyName";

export class DependencyInjector implements DependencyInjectorInterface {
    private dependencies: Record<DependencyName | string, unknown>;
    private extensions: Extension[];

    public constructor() {
        this.dependencies = {};
        this.extensions = [];
    }

    public registerExtension(extension: Extension): void {
        this.extensions.push(extension);
    }

    public getAllExtensions(): Extension[] {
        return this.extensions;
    }

    public registerInstance<T>(name: DependencyName, instance: T): void {
        this.dependencies[name] = instance;
    }

    public getInstance<T>(name: DependencyName): T {
        const instance = this.dependencies[name] as T;

        if (!instance) {
            throw new Error(`Iinstance with name "${name}" not found`);
        }

        return instance;
    }
}
