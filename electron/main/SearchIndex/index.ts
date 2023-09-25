import type { IpcMain } from "electron";
import type { EventEmitter } from "../EventEmitter";
import { InMemorySearchIndex } from "./InMemorySearchIndex";
import type { SearchIndex } from "./SearchIndex";

export type * from "./SearchIndex";

export const useSearchIndex = ({
    eventEmitter,
    ipcMain,
}: {
    eventEmitter: EventEmitter;
    ipcMain: IpcMain;
}): SearchIndex => {
    const searchIndex = new InMemorySearchIndex(eventEmitter);

    ipcMain.on("pluginDisabled", (_, { pluginId }: { pluginId: string }) =>
        searchIndex.removeSearchResultItems(pluginId),
    );

    ipcMain.on("getSearchResultItems", (event) => (event.returnValue = searchIndex.getSearchResultItems()));

    return searchIndex;
};
