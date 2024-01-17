import type { DependencyInjector } from "@Core/DependencyInjector";
import type { SearchResultItemAction } from "@common/Core";
import { ActionHandlerRegistry } from "./ActionHandlerRegistry";
import type { ActionHandler } from "./Contract";
import {
    CommandlineActionHandler,
    CopyToClipboardActionHandler,
    NavigateToActionHandler,
    OpenFilePathActionHandler,
    PowershellActionHandler,
    ShowItemInFileExplorerActionHandler,
    UrlActionHandler,
} from "./DefaultActionHandlers";

export class ActionHandlerModule {
    public static bootstrap(dependencyInjector: DependencyInjector) {
        const commandlineUtility = dependencyInjector.getInstance("CommandlineUtility");
        const powershellUtility = dependencyInjector.getInstance("PowershellUtility");
        const shell = dependencyInjector.getInstance("Shell");
        const clipboard = dependencyInjector.getInstance("Clipboard");
        const eventEmitter = dependencyInjector.getInstance("EventEmitter");
        const ipcMain = dependencyInjector.getInstance("IpcMain");

        const actionHandlerRegistry = new ActionHandlerRegistry();

        dependencyInjector.registerInstance("ActionHandlerRegistry", actionHandlerRegistry);

        const actionHandlers: ActionHandler[] = [
            new CommandlineActionHandler(commandlineUtility),
            new CopyToClipboardActionHandler(clipboard),
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
            eventEmitter.emitEvent("actionInvokationSucceeded", { action });
        });
    }
}
