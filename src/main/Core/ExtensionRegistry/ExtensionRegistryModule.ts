import type { Dependencies } from "@Core/Dependencies";
import type { DependencyRegistry } from "@Core/DependencyRegistry";
import { ExtensionRegistry } from "./ExtensionRegistry";

export class ExtensionRegistryModule {
    public static bootstrap(dependencyRegistry: DependencyRegistry<Dependencies>) {
        dependencyRegistry.register("ExtensionRegistry", new ExtensionRegistry());
    }
}
