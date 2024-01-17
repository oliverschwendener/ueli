import type { DependencyInjector } from "../DependencyInjector";
import { InMemorySearchIndex } from "./InMemorySearchIndex";

export class SearchIndexModule {
    public static bootstrap(dependencyInjector: DependencyInjector) {
        const eventEmitter = dependencyInjector.getInstance("EventEmitter");

        dependencyInjector.registerInstance("SearchIndex", new InMemorySearchIndex(eventEmitter));

        SearchIndexModule.registerIpcMainEventListeners(dependencyInjector);
    }

    private static registerIpcMainEventListeners(dependencyInjector: DependencyInjector) {
        const ipcMain = dependencyInjector.getInstance("IpcMain");
        const searchIndex = dependencyInjector.getInstance("SearchIndex");

        ipcMain.on("extensionDisabled", (_, { extensionId }: { extensionId: string }) =>
            searchIndex.removeSearchResultItems(extensionId),
        );

        ipcMain.on("getSearchResultItems", (event) => (event.returnValue = searchIndex.getSearchResultItems()));
    }
}
