import type { EventEmitter } from "@common/EventEmitter";
import type { SearchIndex } from "@common/SearchIndex";
import type { IpcMain } from "electron";
import { InMemorySearchIndex } from "./InMemorySearchIndex";

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
