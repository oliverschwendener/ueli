import type { UeliModuleRegistry } from "@Core/ModuleRegistry";
import { RandomStringProvider } from "./RandomStringProvider";

export class RandomStringProviderModule {
    public static bootstrap(moduleRegistry: UeliModuleRegistry) {
        moduleRegistry.register("RandomStringProvider", new RandomStringProvider());
    }
}
