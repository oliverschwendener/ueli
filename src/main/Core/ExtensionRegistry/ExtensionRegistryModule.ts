import type { DependencyInjector } from "..";
import type { ExtensionRegistry as ExtensionRegistryInterface } from "./Contract";
import { ExtensionRegistry } from "./ExtensionRegistry";

export class ExtensionRegsitryModule {
    public static bootstrap(dependencyInjector: DependencyInjector) {
        dependencyInjector.registerInstance<ExtensionRegistryInterface>("ExtensionRegistry", new ExtensionRegistry());
    }
}
