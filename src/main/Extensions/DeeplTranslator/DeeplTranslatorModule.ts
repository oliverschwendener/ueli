import type { DependencyInjector } from "@Core/DependencyInjector";
import type { ExtensionBootstrapResult } from "../ExtensionBootstrapResult";
import { DeeplTranslator } from "./DeeplTranslator";

export class DeeplTranslatorModule {
    public static bootstrap(dependencyInjector: DependencyInjector): ExtensionBootstrapResult {
        const net = dependencyInjector.getInstance("Net");
        const assetPathResolver = dependencyInjector.getInstance("AssetPathResolver");
        const settingsManager = dependencyInjector.getInstance("SettingsManager");
        const translator = dependencyInjector.getInstance("Translator");

        return { extension: new DeeplTranslator(net, assetPathResolver, settingsManager, translator) };
    }
}
