import type { Dependencies } from "@Core/Dependencies";
import type { DependencyRegistry } from "@Core/DependencyRegistry";
import type { ExtensionBootstrapResult } from "./ExtensionBootstrapResult";

/**
 * Represents an extension module.
 */
export interface ExtensionModule {
    /**
     * Bootstraps an extension.
     * @param dependencyRegistry The dependency registry to use for dependency injection.
     * @returns The result of bootstrapping the extension.
     */
    bootstrap(dependencyRegistry: DependencyRegistry<Dependencies>): ExtensionBootstrapResult;
}
