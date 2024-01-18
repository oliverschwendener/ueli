import type { Dependencies, DependencyRegistry } from "..";
import { AssetPathResolver } from "./AssetPathResolver";

export class AssetPathResolverModule {
    public static bootstrap(dependencyRegistry: DependencyRegistry<Dependencies>) {
        dependencyRegistry.register("AssetPathResolver", new AssetPathResolver());
    }
}
