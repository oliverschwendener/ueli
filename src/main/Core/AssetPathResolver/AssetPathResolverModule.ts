import type { DependencyInjector } from "..";
import { AssetPathResolver } from "./AssetPathResolver";

export class AssetPathResolverModule {
    public static bootstrap(dependencyInjector: DependencyInjector) {
        dependencyInjector.registerInstance("AssetPathResolver", new AssetPathResolver());
    }
}
