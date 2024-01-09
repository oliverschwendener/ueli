import type { DependencyInjector } from "..";
import type { ExtensionAssetPathResolver as ExtensionAssetPathResolverInterface } from "./Contract";
import { ExtensionAssetPathResolver } from "./ExtensionAssetPathResolver";

export class ExtensionAssetsModule {
    public static bootstrap(dependencyInjector: DependencyInjector) {
        dependencyInjector.registerInstance<ExtensionAssetPathResolverInterface>(
            "ExtensionAssetPathResolver",
            new ExtensionAssetPathResolver(),
        );
    }
}
