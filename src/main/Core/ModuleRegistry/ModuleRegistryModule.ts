import type { UeliModuleRegistry } from "./Contract/UeliModuleRegistry";
import { ModuleRegistry } from "./ModuleRegistry";

export class ModuleRegistryModule {
    public static bootstrap(): UeliModuleRegistry {
        return new ModuleRegistry({});
    }
}
