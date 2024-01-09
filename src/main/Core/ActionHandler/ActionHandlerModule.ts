import type { SearchResultItemAction } from "@common/SearchResultItemAction";
import type { Clipboard, IpcMain, Shell } from "electron";
import type { CommandlineUtility } from "../CommandlineUtility";
import type { DependencyInjector } from "../DependencyInjector";
import type { EventEmitter } from "../EventEmitter";
import type { ActionHandler } from "./Contract";
import {
    CommandlineActionHandler,
    CopyToClipboardActionHandler,
    OpenFilePathActionHandler,
    PowershellActionHandler,
    ShowItemInFileExplorerActionHandler,
    UrlActionHandler,
} from "./DefaultActionHandlers";

export class ActionHandlerModule {
    public static bootstrap(dependencyInjector: DependencyInjector) {
        ActionHandlerModule.registerDefaultActionHandlers(dependencyInjector);
        ActionHandlerModule.registerIpcMainEventHandlers(dependencyInjector);
    }

    private static registerDefaultActionHandlers(dependencyInjector: DependencyInjector): void {
        const commandlineUtility = dependencyInjector.getInstance<CommandlineUtility>("CommandlineUtility");
        const shell = dependencyInjector.getInstance<Shell>("Shell");
        const clipboard = dependencyInjector.getInstance<Clipboard>("Clipboard");

        const actionHandlers: ActionHandler[] = [
            new CommandlineActionHandler(commandlineUtility),
            new CopyToClipboardActionHandler(clipboard),
            new OpenFilePathActionHandler(shell),
            new PowershellActionHandler(commandlineUtility),
            new ShowItemInFileExplorerActionHandler(shell),
            new UrlActionHandler(shell),
        ];

        for (const actionHandler of actionHandlers) {
            dependencyInjector.registerActionHandler(actionHandler);
        }
    }

    private static registerIpcMainEventHandlers(dependencyInjector: DependencyInjector) {
        const eventEmitter = dependencyInjector.getInstance<EventEmitter>("EventEmitter");
        const ipcMain = dependencyInjector.getInstance<IpcMain>("IpcMain");

        ipcMain.handle("invokeAction", async (_, { action }: { action: SearchResultItemAction }) => {
            dependencyInjector.getActionHandler(action.handlerId).invokeAction(action);
            eventEmitter.emitEvent("actionInvokationSucceeded", { action });
        });
    }
}
