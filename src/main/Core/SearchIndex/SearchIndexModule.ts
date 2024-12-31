import type { UeliModuleRegistry } from "@Core/ModuleRegistry";
import type { SearchIndexFile as SearchIndexFileInterface } from "./Contract/SearchIndexFile";
import { SearchIndex } from "./SearchIndex";
import { SearchIndexFile } from "./SearchIndexFile";

export class SearchIndexModule {
    public static bootstrap(moduleRegistry: UeliModuleRegistry) {
        const app = moduleRegistry.get("App");
        const browserWindowNotifier = moduleRegistry.get("BrowserWindowNotifier");
        const fileSystemUtility = moduleRegistry.get("FileSystemUtility");
        const ipcMain = moduleRegistry.get("IpcMain");

        const searchIndexFile: SearchIndexFileInterface = new SearchIndexFile(app, fileSystemUtility);

        const searchIndex = new SearchIndex(browserWindowNotifier, searchIndexFile);

        moduleRegistry.register("SearchIndex", searchIndex);

        ipcMain.on("extensionDisabled", (_, { extensionId }: { extensionId: string }) =>
            searchIndex.removeSearchResultItems(extensionId),
        );

        ipcMain.on("getSearchResultItems", (event) => (event.returnValue = searchIndex.getSearchResultItems()));

        ipcMain.on("searchIndexCacheFileExists", (event) => (event.returnValue = searchIndexFile.exists()));
    }
}
