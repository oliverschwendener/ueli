import type { Dependencies } from "@Core/Dependencies";
import type { DependencyRegistry } from "@Core/DependencyRegistry";
import { InMemorySearchIndex } from "./InMemorySearchIndex";

export class SearchIndexModule {
    public static bootstrap(dependencyRegistry: DependencyRegistry<Dependencies>) {
        const ipcMain = dependencyRegistry.get("IpcMain");

        const searchIndex = new InMemorySearchIndex(dependencyRegistry.get("BrowserWindowNotifier"));

        dependencyRegistry.register("SearchIndex", searchIndex);

        ipcMain.on("extensionDisabled", (_, { extensionId }: { extensionId: string }) =>
            searchIndex.removeSearchResultItems(extensionId),
        );

        ipcMain.on("getSearchResultItems", (event) => (event.returnValue = searchIndex.getSearchResultItems()));
    }
}
