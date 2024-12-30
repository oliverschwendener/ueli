import type { UeliModuleRegistry } from "@Core/ModuleRegistry";
import { InMemorySearchIndex } from "./InMemorySearchIndex";

export class SearchIndexModule {
    public static bootstrap(moduleRegistry: UeliModuleRegistry) {
        const ipcMain = moduleRegistry.get("IpcMain");

        const searchIndex = new InMemorySearchIndex(moduleRegistry.get("BrowserWindowNotifier"));

        moduleRegistry.register("SearchIndex", searchIndex);

        ipcMain.on("extensionDisabled", (_, { extensionId }: { extensionId: string }) =>
            searchIndex.removeSearchResultItems(extensionId),
        );

        ipcMain.on("getSearchResultItems", (event) => (event.returnValue = searchIndex.getSearchResultItems()));
    }
}
