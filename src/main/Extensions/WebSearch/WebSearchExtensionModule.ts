import type { Dependencies } from "@Core/Dependencies";
import type { DependencyRegistry } from "@Core/DependencyRegistry";
import type { ExtensionBootstrapResult } from "../ExtensionBootstrapResult";
import type { ExtensionModule } from "../ExtensionModule";
import { DuckDuckGoWebSearchEngine } from "./DuckDuckGoWebSearchEngine";
import { GoogleWebSearchEngine } from "./GoogleWebSearchEngine";
import { WebSearchExtension } from "./WebSearchExtension";

export class WebSearchExtensionModule implements ExtensionModule {
    public bootstrap(dependencyRegistry: DependencyRegistry<Dependencies>): ExtensionBootstrapResult {
        const net = dependencyRegistry.get("Net");
        const assetPathResolver = dependencyRegistry.get("AssetPathResolver");
        const settingsManager = dependencyRegistry.get("SettingsManager");

        return {
            extension: new WebSearchExtension(assetPathResolver, settingsManager, [
                new DuckDuckGoWebSearchEngine(net),
                new GoogleWebSearchEngine(net),
            ]),
        };
    }
}
