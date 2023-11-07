import { CommandlineUtility } from "@common/CommandlineUtility";
import type { DependencyInjector } from "@common/DependencyInjector";
import { EventEmitter } from "@common/EventEmitter";
import type { ExecutionArgument } from "@common/ExecutionArgument";
import { IpcMain, Shell } from "electron";
import {
    CommandlineExecutionService,
    FilePathExecutionService,
    PowershellExecutionService,
    UrlExecutionService,
} from "./ExecutionServices";
import { Executor } from "./Executor";

export class ExecutorModule {
    public static bootstrap(dependencyInjector: DependencyInjector) {
        const shell = dependencyInjector.getInstance<Shell>("Shell");
        const commandlineUtility = dependencyInjector.getInstance<CommandlineUtility>("CommandlineUtility");
        const eventEmitter = dependencyInjector.getInstance<EventEmitter>("EventEmitter");
        const ipcMain = dependencyInjector.getInstance<IpcMain>("IpcMain");

        const executor = new Executor(
            {
                FilePath: new FilePathExecutionService(shell),
                URL: new UrlExecutionService(shell),
                Powershell: new PowershellExecutionService(commandlineUtility),
                Commandline: new CommandlineExecutionService(commandlineUtility),
            },
            eventEmitter,
        );

        ipcMain.handle("invokeExecution", (_, executionArgument: ExecutionArgument) =>
            executor.execute(executionArgument),
        );
    }
}
