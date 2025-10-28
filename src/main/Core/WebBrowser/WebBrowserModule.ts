import type { WebBrowser as WebBrowserDTO } from "@common/Core";
import type { ModuleRegistry, UeliModules } from "@Core/ModuleRegistry";
import type { WebBrowser } from "./Contract";
import { ChromiumBrowserBookmarkRepository, FirefoxBookmarkRepository } from "./Utility";
import { WebBrowserRegistry } from "./WebBrowserRegistry";
import { Arc, BraveBrowser, Firefox, GoogleChrome, MicrosoftEdge, YandexBrowser, Zen } from "./WebBrowsers/";

export class WebBrowserModule {
    public static bootstrap(moduleRegistry: ModuleRegistry<UeliModules>): void {
        const ipcMain = moduleRegistry.get("IpcMain");

        const webBrowserRegistry = new WebBrowserRegistry([
            ...WebBrowserModule.bootstrapChromiumBasedBrowsers(moduleRegistry),
            ...WebBrowserModule.bootstrapFirefoxBasedBrowsers(moduleRegistry),
        ]);

        moduleRegistry.register("WebBrowserRegistry", webBrowserRegistry);

        ipcMain.on("WebBrowserRegistry:getAllSupported", (event) => {
            event.returnValue = webBrowserRegistry
                .getAll()
                .filter((webBrowser) => webBrowser.isSupported())
                .map((webBrowser): WebBrowserDTO => {
                    return {
                        name: webBrowser.getName(),
                        image: webBrowser.getImage(),
                    };
                });
        });
    }

    private static bootstrapChromiumBasedBrowsers(moduleRegistry: ModuleRegistry<UeliModules>): WebBrowser[] {
        const operatingSystem = moduleRegistry.get("OperatingSystem");
        const app = moduleRegistry.get("App");
        const fileSystemUtility = moduleRegistry.get("FileSystemUtility");
        const assetPathResolver = moduleRegistry.get("AssetPathResolver");

        const chromiumBrowserBookmarkRepository = new ChromiumBrowserBookmarkRepository(fileSystemUtility);

        return [
            new Arc(operatingSystem, app, chromiumBrowserBookmarkRepository, assetPathResolver),
            new BraveBrowser(operatingSystem, app, chromiumBrowserBookmarkRepository, assetPathResolver),
            new GoogleChrome(operatingSystem, app, chromiumBrowserBookmarkRepository, assetPathResolver),
            new MicrosoftEdge(operatingSystem, app, chromiumBrowserBookmarkRepository, assetPathResolver),
            new YandexBrowser(operatingSystem, app, chromiumBrowserBookmarkRepository, assetPathResolver),
        ];
    }

    private static bootstrapFirefoxBasedBrowsers(moduleRegistry: ModuleRegistry<UeliModules>): WebBrowser[] {
        const operatingSystem = moduleRegistry.get("OperatingSystem");
        const app = moduleRegistry.get("App");
        const fileSystemUtility = moduleRegistry.get("FileSystemUtility");
        const assetPathResolver = moduleRegistry.get("AssetPathResolver");
        const iniFileParser = moduleRegistry.get("IniFileParser");

        const firefoxBookmarkRepository = new FirefoxBookmarkRepository(
            operatingSystem,
            app,
            fileSystemUtility,
            iniFileParser,
        );

        return [
            new Firefox(operatingSystem, firefoxBookmarkRepository, assetPathResolver),
            new Zen(operatingSystem, firefoxBookmarkRepository, assetPathResolver),
        ];
    }
}
