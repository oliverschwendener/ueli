import type { AssetPathResolver } from "@Core/AssetPathResolver";
import type { DependencyInjector } from "@Core/DependencyInjector";
import type { Translator } from "@Core/Translator";
import type { UeliCommandInvoker } from "@Core/UeliCommand";
import type { ExtensionBootstrapResult } from "../ExtensionBootstrapResult";
import { UeliCommandActionHandler } from "./UeliCommandActionHandler";
import { UeliCommandExtension } from "./UeliCommandExtension";

export class UeliCommandModule {
    public static bootstrap(dependencyInjector: DependencyInjector): ExtensionBootstrapResult {
        const assetPathResolver = dependencyInjector.getInstance<AssetPathResolver>("AssetPathResolver");
        const ueliCommandInvoker = dependencyInjector.getInstance<UeliCommandInvoker>("UeliCommandInvoker");
        const translator = dependencyInjector.getInstance<Translator>("Translator");

        return {
            extension: new UeliCommandExtension(assetPathResolver, translator),
            actionHandlers: [new UeliCommandActionHandler(ueliCommandInvoker)],
        };
    }
}
