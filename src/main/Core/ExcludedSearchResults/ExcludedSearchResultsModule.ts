import type { Dependencies, DependencyRegistry } from "..";
import { ExcludedSearchResults } from "./ExcludedSearchResults";

export class ExcludedSearchResultsModule {
    public static bootstrap(dependencyRegistry: DependencyRegistry<Dependencies>) {
        const eventEmitter = dependencyRegistry.get("EventEmitter");
        const settingsManager = dependencyRegistry.get("SettingsManager");
        const ipcMain = dependencyRegistry.get("IpcMain");

        const excludedSearchResults = new ExcludedSearchResults(eventEmitter, settingsManager);

        dependencyRegistry.register("ExcludedSearchResults", excludedSearchResults);

        ipcMain.on("getExcludedSearchResultItems", (event) => {
            event.returnValue = excludedSearchResults.getExcludedItems();
        });

        ipcMain.handle("removeExcludedSearchResultItem", (_, { itemId }: { itemId: string }) =>
            excludedSearchResults.removeItem(itemId),
        );
    }
}
