import type { CommandlineUtility } from "@common/CommandlineUtility";
import type { DependencyInjector } from "@common/DependencyInjector";
import type { EventEmitter } from "@common/EventEmitter";
import type { SearchResultItemAction } from "@common/SearchResultItemAction";
import { IpcMain, Shell } from "electron";
import {
    CommandlineActionHandler,
    FilePathActionHandler,
    PowershellActionHandler,
    UrlExecutionService,
} from "./ActionHandlers";
import { ActionInvoker } from "./ActionInvoker";

export class ActionInvokerModule {
    public static bootstrap(dependencyInjector: DependencyInjector) {
        const shell = dependencyInjector.getInstance<Shell>("Shell");
        const commandlineUtility = dependencyInjector.getInstance<CommandlineUtility>("CommandlineUtility");
        const eventEmitter = dependencyInjector.getInstance<EventEmitter>("EventEmitter");
        const ipcMain = dependencyInjector.getInstance<IpcMain>("IpcMain");

        const actionInvoker = new ActionInvoker(
            {
                FilePath: new FilePathActionHandler(shell),
                URL: new UrlExecutionService(shell),
                Powershell: new PowershellActionHandler(commandlineUtility),
                Commandline: new CommandlineActionHandler(commandlineUtility),
            },
            eventEmitter,
        );

        ipcMain.handle("invokeAction", (_, { action }: { action: SearchResultItemAction }) =>
            actionInvoker.invoke(action),
        );
    }
}
