import type { DependencyRegistry } from "../DependencyRegistry";
import { InMemorySearchIndex } from "./InMemorySearchIndex";

export class SearchIndexModule {
    public static bootstrap(dependencyRegistry: DependencyRegistry) {
        const eventEmitter = dependencyRegistry.get("EventEmitter");

        dependencyRegistry.register("SearchIndex", new InMemorySearchIndex(eventEmitter));

        SearchIndexModule.registerIpcMainEventListeners(dependencyRegistry);
    }

    private static registerIpcMainEventListeners(dependencyRegistry: DependencyRegistry) {
        const ipcMain = dependencyRegistry.get("IpcMain");
        const searchIndex = dependencyRegistry.get("SearchIndex");

        ipcMain.on("extensionDisabled", (_, { extensionId }: { extensionId: string }) =>
            searchIndex.removeSearchResultItems(extensionId),
        );

        ipcMain.on("getSearchResultItems", (event) => (event.returnValue = searchIndex.getSearchResultItems()));
    }
}
