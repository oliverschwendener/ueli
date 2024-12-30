import type { UeliModuleRegistry } from "@Core/ModuleRegistry";
import type { ExtensionBootstrapResult } from "../ExtensionBootstrapResult";
import type { ExtensionModule } from "../ExtensionModule";
import { DuckDuckGoWebSearchEngine } from "./DuckDuckGoWebSearchEngine";
import { GoogleWebSearchEngine } from "./GoogleWebSearchEngine";
import { WebSearchExtension } from "./WebSearchExtension";

export class WebSearchExtensionModule implements ExtensionModule {
    public bootstrap(moduleRegistry: UeliModuleRegistry): ExtensionBootstrapResult {
        const net = moduleRegistry.get("Net");
        const assetPathResolver = moduleRegistry.get("AssetPathResolver");
        const settingsManager = moduleRegistry.get("SettingsManager");

        return {
            extension: new WebSearchExtension(assetPathResolver, settingsManager, [
                new DuckDuckGoWebSearchEngine(net),
                new GoogleWebSearchEngine(net),
            ]),
        };
    }
}
