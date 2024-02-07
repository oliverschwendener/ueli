import type { Dependencies } from "@Core/Dependencies";
import type { DependencyRegistry } from "@Core/DependencyRegistry";
import type { ExtensionBootstrapResult } from "../ExtensionBootstrapResult";
import type { ExtensionModule } from "../ExtensionModule";
import { BrowserBookmarks } from "./BrowserBookmarks";
import { ChromiumBrowserBookmarkRepository } from "./ChromiumBrowserBookmarkRepository";

export class BrowserBookmarksModule implements ExtensionModule {
    public bootstrap(dependencyRegistry: DependencyRegistry<Dependencies>): ExtensionBootstrapResult {
        const app = dependencyRegistry.get("App");
        const fileSystemUtility = dependencyRegistry.get("FileSystemUtility");
        const operatingSystem = dependencyRegistry.get("OperatingSystem");
        const settingsManager = dependencyRegistry.get("SettingsManager");
        const assetPathResolver = dependencyRegistry.get("AssetPathResolver");

        return {
            extension: new BrowserBookmarks(
                new ChromiumBrowserBookmarkRepository(app, fileSystemUtility, operatingSystem),
                settingsManager,
                assetPathResolver,
            ),
        };
    }
}
