import type { Dependencies } from "@Core/Dependencies";
import type { DependencyRegistry } from "@Core/DependencyRegistry";
import type { ExtensionBootstrapResult } from "../ExtensionBootstrapResult";
import type { ExtensionModule } from "../ExtensionModule";
import { EnglishDictionary } from "./EnglishDictionary";

export class EnglishDictionaryModule implements ExtensionModule {
    public bootstrap(dependencyRegistry: DependencyRegistry<Dependencies>): ExtensionBootstrapResult {
        const net = dependencyRegistry.get("Net");
        const assetPathResolver = dependencyRegistry.get("AssetPathResolver");
        const settingsManager = dependencyRegistry.get("SettingsManager");

        return {
            extension: new EnglishDictionary(settingsManager, net, assetPathResolver),
        };
    }
}
