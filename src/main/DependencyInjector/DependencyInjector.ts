import type { DependencyInjector as DependencyInjectorInterface } from "@common/DependencyInjector";
import type { DependencyName } from "@common/DependencyName";

export class DependencyInjector implements DependencyInjectorInterface {
    private dependencies: Record<DependencyName | string, unknown>;

    public constructor() {
        this.dependencies = {};
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
