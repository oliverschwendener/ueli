import type { IpcMain } from "electron";
import type { DependencyInjector } from "../DependencyInjector";
import type { EventEmitter } from "../EventEmitter";
import type { SearchIndex } from "./Contract";
import { InMemorySearchIndex } from "./InMemorySearchIndex";

export class SearchIndexModule {
    public static bootstrap(dependencyInjector: DependencyInjector) {
        const eventEmitter = dependencyInjector.getInstance<EventEmitter>("EventEmitter");

        dependencyInjector.registerInstance<SearchIndex>("SearchIndex", new InMemorySearchIndex(eventEmitter));

        SearchIndexModule.registerIpcMainEventListeners(dependencyInjector);
    }

    private static registerIpcMainEventListeners(dependencyInjector: DependencyInjector) {
        const ipcMain = dependencyInjector.getInstance<IpcMain>("IpcMain");
        const searchIndex = dependencyInjector.getInstance<SearchIndex>("SearchIndex");

        ipcMain.on("extensionDisabled", (_, { extensionId }: { extensionId: string }) =>
            searchIndex.removeSearchResultItems(extensionId),
        );

        ipcMain.on("getSearchResultItems", (event) => (event.returnValue = searchIndex.getSearchResultItems()));
    }
}
