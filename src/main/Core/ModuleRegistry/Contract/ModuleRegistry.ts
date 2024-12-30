/**
 * Represents a generic module registry.
 */
export interface ModuleRegistry<T extends Record<string, unknown>> {
    /**
     * Registers an instance with the given name.
     * @param name The name to register the instance with, e.g. `"myInstance"`.
     * @param instance The instance to register, e.g. `new MyInstance()`.
     */
    register<Name extends keyof T>(name: Name, instance: T[Name]): void;

    /**
     * Gets an instance with the given name.
     * @param name The name of the instance to get, e.g. `"myInstance"`.
     * @returns The instance, e.g. `MyInstance`.
     * @throws If no instance with the given name has been registered.
     */
    get<Name extends keyof T>(name: Name): T[Name];
}
