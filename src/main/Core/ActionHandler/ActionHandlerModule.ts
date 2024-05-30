import type { Dependencies } from "@Core/Dependencies";
import type { DependencyRegistry } from "@Core/DependencyRegistry";
import type { SearchResultItemAction } from "@common/Core";
import { ActionHandlerRegistry } from "./ActionHandlerRegistry";
import type { ActionHandler } from "./Contract";
import {
    CommandlineActionHandler,
    CopyToClipboardActionHandler,
    ExcludeFromSearchResultsActionHandler,
    FavoritesActionHandler,
    NavigateToActionHandler,
    OpenFilePathActionHandler,
    PowershellActionHandler,
    ShowItemInFileExplorerActionHandler,
    UrlActionHandler,
} from "./DefaultActionHandlers";

export class ActionHandlerModule {
    public static bootstrap(dependencyRegistry: DependencyRegistry<Dependencies>) {
        const eventEmitter = dependencyRegistry.get("EventEmitter");
        const ipcMain = dependencyRegistry.get("IpcMain");

        const actionHandlerRegistry = new ActionHandlerRegistry();

        dependencyRegistry.register("ActionHandlerRegistry", actionHandlerRegistry);

        const actionHandlers: ActionHandler[] = [
            new CommandlineActionHandler(dependencyRegistry.get("CommandlineUtility")),
            new CopyToClipboardActionHandler(
                dependencyRegistry.get("Clipboard"),
                dependencyRegistry.get("BrowserWindowNotifier"),
            ),
            new ExcludeFromSearchResultsActionHandler(dependencyRegistry.get("ExcludedSearchResults")),
            new FavoritesActionHandler(dependencyRegistry.get("FavoriteManager")),
            new NavigateToActionHandler(eventEmitter),
            new OpenFilePathActionHandler(dependencyRegistry.get("Shell")),
            new PowershellActionHandler(dependencyRegistry.get("PowershellUtility")),
            new ShowItemInFileExplorerActionHandler(dependencyRegistry.get("Shell")),
            new UrlActionHandler(dependencyRegistry.get("Shell")),
        ];

        for (const actionHandler of actionHandlers) {
            actionHandlerRegistry.register(actionHandler);
        }

        ipcMain.handle("invokeAction", async (_, { action }: { action: SearchResultItemAction }) => {
            await actionHandlerRegistry.getById(action.handlerId).invokeAction(action);
            eventEmitter.emitEvent("actionInvoked");
        });
    }
}
