import type { DependencyInjector as DependencyInjectorInterface } from "@common/DependencyInjector";
import type { DependencyName } from "@common/DependencyName";
import type { UeliPlugin } from "@common/UeliPlugin";

export class DependencyInjector implements DependencyInjectorInterface {
    private dependencies: Record<DependencyName | string, unknown>;
    private plugins: UeliPlugin[];

    public constructor() {
        this.dependencies = {};
        this.plugins = [];
    }

    public registerPlugin(plugin: UeliPlugin): void {
        this.plugins.push(plugin);
    }

    public getAllPlugins(): UeliPlugin[] {
        return this.plugins;
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
