export interface EnvironmentVariableProvider {
    getAll(): Record<string, string>;
    get(name: string): string | undefined;
}
