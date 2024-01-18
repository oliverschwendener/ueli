import type { DependencyRegistry as DependencyRegistryInterface } from "./Contract";

export class DependencyRegistry<T extends Record<string, unknown>> implements DependencyRegistryInterface<T> {
    public constructor(private readonly dependencies: T) {}

    public register<Name extends keyof T>(name: Name, instance: T[Name]): void {
        const key = this.nameToKey(name);

        if (Object.keys(this.dependencies).includes(key)) {
            throw new Error(`Dependency "${key}" is already registered`);
        }

        this.dependencies[name] = instance;
    }

    public get<Name extends keyof T>(name: Name): T[Name] {
        const key = this.nameToKey(name);

        if (!Object.keys(this.dependencies).includes(key)) {
            throw new Error(`Dependency with name "${key}" could not be found`);
        }

        return this.dependencies[name];
    }

    private nameToKey<Name extends keyof T>(name: Name): string {
        return String(name);
    }
}
