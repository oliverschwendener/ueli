import type { WebBrowser as WebBrowserDTO } from "@common/Core";
import type { ModuleRegistry, UeliModules } from "@Core/ModuleRegistry";
import { ChromiumBrowserBookmarkRepository, FirefoxBookmarkFilePathResolver } from "./Utility";
import { WebBrowserRegistry } from "./WebBrowserRegistry";
import { Arc, BraveBrowser, Firefox, GoogleChrome, MicrosoftEdge, YandexBrowser } from "./WebBrowsers/";

export class WebBrowserModule {
    public static bootstrap(moduleRegistry: ModuleRegistry<UeliModules>): void {
        const operatingSystem = moduleRegistry.get("OperatingSystem");
        const app = moduleRegistry.get("App");
        const fileSystemUtility = moduleRegistry.get("FileSystemUtility");
        const assetPathResolver = moduleRegistry.get("AssetPathResolver");
        const iniFileParser = moduleRegistry.get("IniFileParser");
        const ipcMain = moduleRegistry.get("IpcMain");

        const chromiumBrowserBookmarkRepository = new ChromiumBrowserBookmarkRepository(fileSystemUtility);

        const firefoxBookmarkFilePathResolver = new FirefoxBookmarkFilePathResolver(
            operatingSystem,
            app,
            fileSystemUtility,
            iniFileParser,
        );

        const webBrowserRegistry = new WebBrowserRegistry([
            new Arc(operatingSystem, app, chromiumBrowserBookmarkRepository, assetPathResolver),
            new BraveBrowser(operatingSystem, app, chromiumBrowserBookmarkRepository, assetPathResolver),
            new GoogleChrome(operatingSystem, app, chromiumBrowserBookmarkRepository, assetPathResolver),
            new MicrosoftEdge(operatingSystem, app, chromiumBrowserBookmarkRepository, assetPathResolver),
            new YandexBrowser(operatingSystem, app, chromiumBrowserBookmarkRepository, assetPathResolver),
            new Firefox(operatingSystem, firefoxBookmarkFilePathResolver, assetPathResolver),
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
}
