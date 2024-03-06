import type { Dependencies } from "@Core/Dependencies";
import type { DependencyRegistry } from "@Core/DependencyRegistry";
import { ExcludedSearchResults } from "./ExcludedSearchResults";

export class ExcludedSearchResultsModule {
    public static bootstrap(dependencyRegistry: DependencyRegistry<Dependencies>) {
        const ipcMain = dependencyRegistry.get("IpcMain");

        const excludedSearchResults = new ExcludedSearchResults(
            dependencyRegistry.get("BrowserWindowNotifier"),
            dependencyRegistry.get("SettingsManager"),
        );

        dependencyRegistry.register("ExcludedSearchResults", excludedSearchResults);

        ipcMain.on(
            "getExcludedSearchResultItemIds",
            (event) => (event.returnValue = excludedSearchResults.getExcludedIds()),
        );

        ipcMain.handle("removeExcludedSearchResultItem", (_, { itemId }: { itemId: string }) =>
            excludedSearchResults.remove(itemId),
        );
    }
}
