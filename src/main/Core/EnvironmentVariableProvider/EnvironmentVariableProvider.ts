import type { EnvironmentVariableProvider as EnvironmentVariableProviderInterface } from "./Contract";

export class EnvironmentVariableProvider implements EnvironmentVariableProviderInterface {
    public constructor(private readonly environmentVariables: Record<string, string>) {}

    public getAll(): Record<string, string> {
        return this.environmentVariables;
    }

    public get(name: string): string {
        return this.environmentVariables[name];
    }
}
