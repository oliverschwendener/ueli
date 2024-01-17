import type { DependencyInjector } from "@Core/DependencyInjector";
import type { ExtensionBootstrapResult } from "../ExtensionBootstrapResult";
import { UeliCommandActionHandler } from "./UeliCommandActionHandler";
import { UeliCommandExtension } from "./UeliCommandExtension";

export class UeliCommandModule {
    public static bootstrap(dependencyInjector: DependencyInjector): ExtensionBootstrapResult {
        const assetPathResolver = dependencyInjector.getInstance("AssetPathResolver");
        const ueliCommandInvoker = dependencyInjector.getInstance("UeliCommandInvoker");
        const translator = dependencyInjector.getInstance("Translator");

        return {
            extension: new UeliCommandExtension(assetPathResolver, translator),
            actionHandlers: [new UeliCommandActionHandler(ueliCommandInvoker)],
        };
    }
}
