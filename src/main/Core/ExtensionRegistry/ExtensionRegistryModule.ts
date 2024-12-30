import type { UeliModuleRegistry } from "@Core/ModuleRegistry";
import { ExtensionRegistry } from "./ExtensionRegistry";

export class ExtensionRegistryModule {
    public static bootstrap(moduleRegistry: UeliModuleRegistry) {
        moduleRegistry.register("ExtensionRegistry", new ExtensionRegistry());
    }
}
