import type { UeliModuleRegistry } from "@Core/ModuleRegistry";
import { ExcludeFromSearchResultsActionHandler } from "./ActionHandler";
import { ExcludedSearchResults } from "./ExcludedSearchResults";

export class ExcludedSearchResultsModule {
    public static bootstrap(moduleRegistry: UeliModuleRegistry) {
        const ipcMain = moduleRegistry.get("IpcMain");

        const excludedSearchResults = new ExcludedSearchResults(
            moduleRegistry.get("BrowserWindowNotifier"),
            moduleRegistry.get("SettingsManager"),
        );

        moduleRegistry
            .get("ActionHandlerRegistry")
            .register(new ExcludeFromSearchResultsActionHandler(excludedSearchResults));

        ipcMain.on(
            "getExcludedSearchResultItemIds",
            (event) => (event.returnValue = excludedSearchResults.getExcludedIds()),
        );

        ipcMain.handle("removeExcludedSearchResultItem", (_, { itemId }: { itemId: string }) =>
            excludedSearchResults.remove(itemId),
        );
    }
}
