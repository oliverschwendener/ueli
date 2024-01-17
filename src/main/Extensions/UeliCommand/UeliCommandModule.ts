import type { DependencyRegistry } from "@Core/DependencyRegistry";
import type { ExtensionBootstrapResult } from "../ExtensionBootstrapResult";
import { UeliCommandActionHandler } from "./UeliCommandActionHandler";
import { UeliCommandExtension } from "./UeliCommandExtension";

export class UeliCommandModule {
    public static bootstrap(dependencyRegistry: DependencyRegistry): ExtensionBootstrapResult {
        const assetPathResolver = dependencyRegistry.get("AssetPathResolver");
        const ueliCommandInvoker = dependencyRegistry.get("UeliCommandInvoker");
        const translator = dependencyRegistry.get("Translator");

        return {
            extension: new UeliCommandExtension(assetPathResolver, translator),
            actionHandlers: [new UeliCommandActionHandler(ueliCommandInvoker)],
        };
    }
}
