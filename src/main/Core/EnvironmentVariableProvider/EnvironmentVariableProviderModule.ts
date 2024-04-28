import type { Dependencies } from "@Core/Dependencies";
import type { DependencyRegistry } from "@Core/DependencyRegistry";
import { EnvironmentVariableProvider } from "./EnvironmentVariableProvider";

export class EnvironmentVariableProviderModule {
    public static bootstrap(dependencyRegistry: DependencyRegistry<Dependencies>): void {
        dependencyRegistry.register("EnvironmentVariableProvider", new EnvironmentVariableProvider(process.env));
    }
}
