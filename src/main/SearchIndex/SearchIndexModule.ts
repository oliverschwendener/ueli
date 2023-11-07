import type { DependencyInjector } from "@common/DependencyInjector";
import type { EventEmitter } from "@common/EventEmitter";
import type { SearchIndex } from "@common/SearchIndex";
import type { IpcMain } from "electron";
import { InMemorySearchIndex } from "./InMemorySearchIndex";

export class SearchIndexModule {
    public static bootstrap(dependencyInjector: DependencyInjector) {
        const eventEmitter = dependencyInjector.getInstance<EventEmitter>("EventEmitter");
        const ipcMain = dependencyInjector.getInstance<IpcMain>("IpcMain");

        const searchIndex = new InMemorySearchIndex(eventEmitter);

        ipcMain.on("pluginDisabled", (_, { pluginId }: { pluginId: string }) =>
            searchIndex.removeSearchResultItems(pluginId),
        );

        ipcMain.on("getSearchResultItems", (event) => (event.returnValue = searchIndex.getSearchResultItems()));

        dependencyInjector.registerInstance<SearchIndex>("SearchIndex", searchIndex);
    }
}
