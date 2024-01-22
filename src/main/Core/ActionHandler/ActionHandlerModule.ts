import type { Dependencies } from "@Core/Dependencies";
import type { DependencyRegistry } from "@Core/DependencyRegistry";
import type { SearchResultItemAction } from "@common/Core";
import { ActionHandlerRegistry } from "./ActionHandlerRegistry";
import type { ActionHandler } from "./Contract";
import {
    CommandlineActionHandler,
    CopyToClipboardActionHandler,
    ExcludeFromSearchResultsActionHandler,
    NavigateToActionHandler,
    OpenFilePathActionHandler,
    PowershellActionHandler,
    ShowItemInFileExplorerActionHandler,
    UrlActionHandler,
} from "./DefaultActionHandlers";

export class ActionHandlerModule {
    public static bootstrap(dependencyRegistry: DependencyRegistry<Dependencies>) {
        const commandlineUtility = dependencyRegistry.get("CommandlineUtility");
        const powershellUtility = dependencyRegistry.get("PowershellUtility");
        const shell = dependencyRegistry.get("Shell");
        const clipboard = dependencyRegistry.get("Clipboard");
        const eventEmitter = dependencyRegistry.get("EventEmitter");
        const ipcMain = dependencyRegistry.get("IpcMain");
        const excludedSearchResults = dependencyRegistry.get("ExcludedSearchResults");

        const actionHandlerRegistry = new ActionHandlerRegistry();

        dependencyRegistry.register("ActionHandlerRegistry", actionHandlerRegistry);

        const actionHandlers: ActionHandler[] = [
            new CommandlineActionHandler(commandlineUtility),
            new CopyToClipboardActionHandler(clipboard),
            new ExcludeFromSearchResultsActionHandler(excludedSearchResults),
            new NavigateToActionHandler(eventEmitter),
            new OpenFilePathActionHandler(shell),
            new PowershellActionHandler(powershellUtility),
            new ShowItemInFileExplorerActionHandler(shell),
            new UrlActionHandler(shell),
        ];

        for (const actionHandler of actionHandlers) {
            actionHandlerRegistry.register(actionHandler);
        }

        ipcMain.handle("invokeAction", async (_, { action }: { action: SearchResultItemAction }) => {
            await actionHandlerRegistry.getById(action.handlerId).invokeAction(action);
            eventEmitter.emitEvent("actionInvocationSucceeded", { action });
        });
    }
}
