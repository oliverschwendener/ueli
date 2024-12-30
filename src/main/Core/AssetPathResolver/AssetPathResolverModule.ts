import type { UeliModuleRegistry } from "@Core/ModuleRegistry";
import { AssetPathResolver } from "./AssetPathResolver";

export class AssetPathResolverModule {
    public static bootstrap(moduleRegistry: UeliModuleRegistry) {
        moduleRegistry.register("AssetPathResolver", new AssetPathResolver());
    }
}
