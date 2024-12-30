import type { UeliModuleRegistry } from "@Core/ModuleRegistry";
import type { ExtensionBootstrapResult } from "../ExtensionBootstrapResult";
import type { ExtensionModule } from "../ExtensionModule";
import { BrowserBookmarks } from "./BrowserBookmarks";
import { ChromiumBrowserBookmarkRepository } from "./ChromiumBrowserBookmarkRepository";
import { FirefoxBookmarkFileResolver } from "./FirefoxBookmarkFileResolver";
import { FirefoxBrowserBookmarkRepository } from "./FirefoxBrowserBookmarkRepository";
import { resolveChromiumBookmarksFilePath } from "./resolveChromiumBookmarksFilePath";

export class BrowserBookmarksModule implements ExtensionModule {
    public bootstrap(moduleRegistry: UeliModuleRegistry): ExtensionBootstrapResult {
        const app = moduleRegistry.get("App");
        const fileSystemUtility = moduleRegistry.get("FileSystemUtility");
        const operatingSystem = moduleRegistry.get("OperatingSystem");
        const settingsManager = moduleRegistry.get("SettingsManager");
        const assetPathResolver = moduleRegistry.get("AssetPathResolver");
        const urlImageGenerator = moduleRegistry.get("UrlImageGenerator");
        const translator = moduleRegistry.get("Translator");

        return {
            extension: new BrowserBookmarks(
                {
                    Firefox: new FirefoxBrowserBookmarkRepository(
                        new FirefoxBookmarkFileResolver(
                            operatingSystem,
                            app,
                            fileSystemUtility,
                            moduleRegistry.get("IniFileParser"),
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
