export interface DependencyRegistry<T extends Record<string, unknown>> {
    register<Name extends keyof T>(name: Name, instance: T[Name]): void;
    get<Name extends keyof T>(name: Name): T[Name];
}
