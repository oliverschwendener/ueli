import type { CommandlineUtility } from "@common/CommandlineUtility";
import type { EventEmitter } from "@common/EventEmitter";
import type { ExecutionArgument } from "@common/ExecutionArgument";
import type { IpcMain, Shell } from "electron";
import {
    CommandlineExecutionService,
    FilePathExecutionService,
    PowershellExecutionService,
    UrlExecutionService,
} from "./ExecutionServices";
import { Executor } from "./Executor";

export const useExecutor = ({
    commandlineUtility,
    eventEmitter,
    ipcMain,
    shell,
}: {
    commandlineUtility: CommandlineUtility;
    eventEmitter: EventEmitter;
    ipcMain: IpcMain;
    shell: Shell;
}) => {
    const executor = new Executor(
        {
            FilePath: new FilePathExecutionService(shell),
            URL: new UrlExecutionService(shell),
            Powershell: new PowershellExecutionService(commandlineUtility),
            Commandline: new CommandlineExecutionService(commandlineUtility),
        },
        eventEmitter,
    );

    ipcMain.handle("invokeExecution", (_, executionArgument: ExecutionArgument) => executor.execute(executionArgument));

    return executor;
};
