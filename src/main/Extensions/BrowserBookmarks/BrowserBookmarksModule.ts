import type { Dependencies } from "@Core/Dependencies";
import type { DependencyRegistry } from "@Core/DependencyRegistry";
import type { ExtensionBootstrapResult } from "../ExtensionBootstrapResult";
import type { ExtensionModule } from "../ExtensionModule";
import { BrowserBookmarks } from "./BrowserBookmarks";
import { ChromiumBrowserBookmarkRepository } from "./ChromiumBrowserBookmarkRepository";
import { FirefoxBookmarkFileResolver } from "./FirefoxBookmarkFileResolver";
import { FirefoxBrowserBookmarkRepository } from "./FirefoxBrowserBookmarkRepository";
import { resolveChromiumBookmarksFilePath } from "./resolveChromiumBookmarksFilePath";

export class BrowserBookmarksModule implements ExtensionModule {
    public bootstrap(dependencyRegistry: DependencyRegistry<Dependencies>): ExtensionBootstrapResult {
        const app = dependencyRegistry.get("App");
        const fileSystemUtility = dependencyRegistry.get("FileSystemUtility");
        const operatingSystem = dependencyRegistry.get("OperatingSystem");
        const settingsManager = dependencyRegistry.get("SettingsManager");
        const assetPathResolver = dependencyRegistry.get("AssetPathResolver");
        const urlImageGenerator = dependencyRegistry.get("UrlImageGenerator");
        const translator = dependencyRegistry.get("Translator");

        return {
            extension: new BrowserBookmarks(
                {
                    Firefox: new FirefoxBrowserBookmarkRepository(
                        new FirefoxBookmarkFileResolver(
                            operatingSystem,
                            app,
                            fileSystemUtility,
                            dependencyRegistry.get("IniFileParser"),
                        ),
                    ),
                    Arc: new ChromiumBrowserBookmarkRepository(fileSystemUtility, () =>
                        resolveChromiumBookmarksFilePath({ browser: "Arc", operatingSystem, app }),
                    ),
                    "Brave Browser": new ChromiumBrowserBookmarkRepository(fileSystemUtility, () =>
                        resolveChromiumBookmarksFilePath({ browser: "Brave Browser", operatingSystem, app }),
                    ),
                    "Google Chrome": new ChromiumBrowserBookmarkRepository(fileSystemUtility, () =>
                        resolveChromiumBookmarksFilePath({ browser: "Google Chrome", operatingSystem, app }),
                    ),
                    "Microsoft Edge": new ChromiumBrowserBookmarkRepository(fileSystemUtility, () =>
                        resolveChromiumBookmarksFilePath({ browser: "Microsoft Edge", operatingSystem, app }),
                    ),
                    "Yandex Browser": new ChromiumBrowserBookmarkRepository(fileSystemUtility, () =>
                        resolveChromiumBookmarksFilePath({ browser: "Yandex Browser", operatingSystem, app }),
                    ),
                },
                settingsManager,
                assetPathResolver,
                urlImageGenerator,
                operatingSystem,
                translator,
            ),
        };
    }
}
