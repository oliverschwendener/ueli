import type { DependencyRegistry } from "..";
import { ExtensionRegistry } from "./ExtensionRegistry";

export class ExtensionRegistryModule {
    public static bootstrap(dependencyRegistry: DependencyRegistry) {
        dependencyRegistry.register("ExtensionRegistry", new ExtensionRegistry());
    }
}
