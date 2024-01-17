import type { DependencyRegistry } from "..";
import { AssetPathResolver } from "./AssetPathResolver";

export class AssetPathResolverModule {
    public static bootstrap(dependencyRegistry: DependencyRegistry) {
        dependencyRegistry.register("AssetPathResolver", new AssetPathResolver());
    }
}
