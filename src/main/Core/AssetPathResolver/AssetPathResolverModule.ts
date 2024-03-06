import type { Dependencies } from "@Core/Dependencies";
import type { DependencyRegistry } from "@Core/DependencyRegistry";
import { AssetPathResolver } from "./AssetPathResolver";

export class AssetPathResolverModule {
    public static bootstrap(dependencyRegistry: DependencyRegistry<Dependencies>) {
        dependencyRegistry.register("AssetPathResolver", new AssetPathResolver());
    }
}
