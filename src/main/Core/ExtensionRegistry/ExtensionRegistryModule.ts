import type { DependencyRegistry } from "..";
import { ExtensionRegistry } from "./ExtensionRegistry";

export class ExtensionRegsitryModule {
    public static bootstrap(dependencyRegistry: DependencyRegistry) {
        dependencyRegistry.register("ExtensionRegistry", new ExtensionRegistry());
    }
}
