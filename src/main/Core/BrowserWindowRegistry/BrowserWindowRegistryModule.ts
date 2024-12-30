import type { UeliModuleRegistry } from "@Core/ModuleRegistry";
import { BrowserWindowRegistry } from "./BrowserWindowRegistry";

export class BrowserWindowRegistryModule {
    public static bootstrap(moduleRegistry: UeliModuleRegistry) {
        moduleRegistry.register("BrowserWindowRegistry", new BrowserWindowRegistry());
    }
}
