import type { AssetPathResolver } from "@Core/AssetPathResolver";
import type { DependencyInjector } from "@Core/DependencyInjector";
import type { Translator } from "@Core/Translator";
import type { UeliCommandInvoker } from "@Core/UeliCommand";
import { UeliCommandActionHandler } from "./UeliCommandActionHandler";
import { UeliCommandExtension } from "./UeliCommandExtension";

export class UeliCommandModule {
    public static bootstrap(dependencyInjector: DependencyInjector) {
        const assetPathResolver = dependencyInjector.getInstance<AssetPathResolver>("AssetPathResolver");

        const ueliCommandInvoker = dependencyInjector.getInstance<UeliCommandInvoker>("UeliCommandInvoker");
        const translator = dependencyInjector.getInstance<Translator>("Translator");

        dependencyInjector.registerExtension(new UeliCommandExtension(assetPathResolver, translator));
        dependencyInjector.registerActionHandler(new UeliCommandActionHandler(ueliCommandInvoker));
    }
}
