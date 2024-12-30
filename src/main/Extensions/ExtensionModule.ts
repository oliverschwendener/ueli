import type { UeliModuleRegistry } from "@Core/ModuleRegistry";
import type { ExtensionBootstrapResult } from "./ExtensionBootstrapResult";

/**
 * Represents an extension module.
 */
export interface ExtensionModule {
    /**
     * Bootstraps an extension.
     * @param moduleRegistry The module registry to use for module injection.
     * @returns The result of bootstrapping the extension.
     */
    bootstrap(moduleRegistry: UeliModuleRegistry): ExtensionBootstrapResult;
}
