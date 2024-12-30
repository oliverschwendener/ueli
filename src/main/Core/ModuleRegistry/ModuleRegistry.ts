import type { ModuleRegistry as ModuleRegistryInterface } from "./Contract";

export class ModuleRegistry<T extends Record<string, unknown>> implements ModuleRegistryInterface<T> {
    public constructor(private readonly modules: T) {}

    public register<Name extends keyof T>(name: Name, instance: T[Name]): void {
        const key = this.nameToKey(name);

        if (Object.keys(this.modules).includes(key)) {
            throw new Error(`Module "${key}" is already registered`);
        }

        this.modules[name] = instance;
    }

    public get<Name extends keyof T>(name: Name): T[Name] {
        const key = this.nameToKey(name);

        if (!Object.keys(this.modules).includes(key)) {
            throw new Error(`Module with name "${key}" could not be found`);
        }

        return this.modules[name];
    }

    private nameToKey<Name extends keyof T>(name: Name): string {
        return String(name);
    }
}
