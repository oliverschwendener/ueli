import type { Dependencies } from "@Core/Dependencies";
import type { DependencyRegistry } from "@Core/DependencyRegistry";
import type { ExtensionBootstrapResult } from "../ExtensionBootstrapResult";
import { DeeplTranslator } from "./DeeplTranslator";

export class DeeplTranslatorModule {
    public static bootstrap(dependencyRegistry: DependencyRegistry<Dependencies>): ExtensionBootstrapResult {
        const net = dependencyRegistry.get("Net");
        const assetPathResolver = dependencyRegistry.get("AssetPathResolver");
        const settingsManager = dependencyRegistry.get("SettingsManager");
        const translator = dependencyRegistry.get("Translator");

        return { extension: new DeeplTranslator(net, assetPathResolver, settingsManager, translator) };
    }
}
