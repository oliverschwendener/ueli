import type { DependencyInjector } from "@Core/DependencyInjector";
import type { ExtensionAssetPathResolver } from "@Core/ExtensionAssets";
import type { Translator } from "@Core/Translator";
import type { UeliCommandInvoker } from "@Core/UeliCommand";
import { UeliCommandActionHandler } from "./UeliCommandActionHandler";
import { UeliCommandExtension } from "./UeliCommandExtension";

export class UeliCommandModule {
    public static bootstrap(dependencyInjector: DependencyInjector) {
        const extensionAssetPathResolver =
            dependencyInjector.getInstance<ExtensionAssetPathResolver>("ExtensionAssetPathResolver");

        const ueliCommandInvoker = dependencyInjector.getInstance<UeliCommandInvoker>("UeliCommandInvoker");
        const translator = dependencyInjector.getInstance<Translator>("Translator");

        dependencyInjector.registerExtension(new UeliCommandExtension(extensionAssetPathResolver, translator));
        dependencyInjector.registerActionHandler(new UeliCommandActionHandler(ueliCommandInvoker));
    }
}
