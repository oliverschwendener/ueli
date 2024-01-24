import type { Dependencies } from "@Core/Dependencies";
import type { DependencyRegistry } from "@Core/DependencyRegistry";
import type { ExtensionBootstrapResult } from "../ExtensionBootstrapResult";
import type { ExtensionModule } from "../ExtensionModule";
import { DeeplTranslator } from "./DeeplTranslator";

export class DeeplTranslatorModule implements ExtensionModule {
    public bootstrap(dependencyRegistry: DependencyRegistry<Dependencies>): ExtensionBootstrapResult {
        const net = dependencyRegistry.get("Net");
        const assetPathResolver = dependencyRegistry.get("AssetPathResolver");
        const settingsManager = dependencyRegistry.get("SettingsManager");
        const translator = dependencyRegistry.get("Translator");

        return { extension: new DeeplTranslator(net, assetPathResolver, settingsManager, translator) };
    }
}
