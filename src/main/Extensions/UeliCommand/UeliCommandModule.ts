import type { DependencyInjector } from "@Core/DependencyInjector";
import type { ExtensionAssetPathResolver } from "@Core/ExtensionAssets";
import type { UeliCommandInvoker } from "@Core/UeliCommand";
import { UeliCommandActionHandler } from "./UeliCommandActionHandler";
import { UeliCommandExtension } from "./UeliCommandExtension";

export class UeliCommandModule {
    public static bootstrap(dependencyInjector: DependencyInjector) {
        const extensionAssetPathResolver =
            dependencyInjector.getInstance<ExtensionAssetPathResolver>("ExtensionAssetPathResolver");

        const ueliCommandInvoker = dependencyInjector.getInstance<UeliCommandInvoker>("UeliCommandInvoker");

        dependencyInjector.registerExtension(new UeliCommandExtension(extensionAssetPathResolver));
        dependencyInjector.registerActionHandler(new UeliCommandActionHandler(ueliCommandInvoker));
    }
}
