import type { SearchResultItemAction } from "@common/SearchResultItemAction";
import type { IpcMain, Shell } from "electron";
import type { CommandlineUtility } from "../CommandlineUtility";
import type { DependencyInjector } from "../DependencyInjector";
import type { EventEmitter } from "../EventEmitter";
import {
    CommandlineActionHandler,
    OpenFilePathActionHandler,
    PowershellActionHandler,
    ShowItemInFileExplorerActionHandler,
    UrlActionHandler,
} from "./ActionHandlers";
import type { ActionHandler } from "./Contract";

export class ActionInvokerModule {
    public static bootstrap(dependencyInjector: DependencyInjector) {
        ActionInvokerModule.registerDefaultActionHandlers(dependencyInjector);

        const eventEmitter = dependencyInjector.getInstance<EventEmitter>("EventEmitter");
        const ipcMain = dependencyInjector.getInstance<IpcMain>("IpcMain");

        ipcMain.handle("invokeAction", async (_, { action }: { action: SearchResultItemAction }) => {
            const actionHandler = dependencyInjector
                .getAllActionHandlers()
                .find((actionHandler) => actionHandler.id === action.handlerId);

            if (!actionHandler) {
                throw new Error(
                    `Unable to invoke action. Reason: action handler with id ${action.handlerId} not found`,
                );
            }

            await actionHandler.invoke(action);

            eventEmitter.emitEvent("actionInvokationSucceeded", { action });
        });
    }

    private static registerDefaultActionHandlers(dependencyInjector: DependencyInjector): void {
        const commandlineUtility = dependencyInjector.getInstance<CommandlineUtility>("CommandlineUtility");
        const shell = dependencyInjector.getInstance<Shell>("Shell");

        const actionHandlers: ActionHandler[] = [
            new CommandlineActionHandler(commandlineUtility),
            new OpenFilePathActionHandler(shell),
            new PowershellActionHandler(commandlineUtility),
            new ShowItemInFileExplorerActionHandler(shell),
            new UrlActionHandler(shell),
        ];

        for (const actionHandler of actionHandlers) {
            dependencyInjector.registerActionHandler(actionHandler);
        }
    }
}
