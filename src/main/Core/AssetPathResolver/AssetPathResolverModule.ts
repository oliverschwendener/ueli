import type { DependencyInjector } from "..";
import { AssetPathResolver } from "./AssetPathResolver";
import type { AssetPathResolver as AssetPathResolverInterface } from "./Contract";

export class AssetPathResolverModule {
    public static bootstrap(dependencyInjector: DependencyInjector) {
        dependencyInjector.registerInstance<AssetPathResolverInterface>("AssetPathResolver", new AssetPathResolver());
    }
}
