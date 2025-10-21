import type { UeliModuleRegistry } from "@Core/ModuleRegistry";
import type { ExtensionBootstrapResult } from "../ExtensionBootstrapResult";
import type { ExtensionModule } from "../ExtensionModule";
import { BrowserBookmarks } from "./BrowserBookmarks";

export class BrowserBookmarksModule implements ExtensionModule {
    public bootstrap(moduleRegistry: UeliModuleRegistry): ExtensionBootstrapResult {
        const operatingSystem = moduleRegistry.get("OperatingSystem");
        const settingsManager = moduleRegistry.get("SettingsManager");
        const assetPathResolver = moduleRegistry.get("AssetPathResolver");
        const translator = moduleRegistry.get("Translator");
        const webBrowserRegistry = moduleRegistry.get("WebBrowserRegistry");
        const urlImageGenerator = moduleRegistry.get("UrlImageGenerator");
        const logger = moduleRegistry.get("Logger");

        return {
            extension: new BrowserBookmarks(
                webBrowserRegistry,
                settingsManager,
                assetPathResolver,
                operatingSystem,
                translator,
                urlImageGenerator,
                logger,
            ),
        };
    }
}
