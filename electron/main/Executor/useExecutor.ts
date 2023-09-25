import type { ExecutionArgument } from "@common/ExecutionArgument";
import type { IpcMain, Shell } from "electron";
import type { EventEmitter } from "../EventEmitter";
import type { CommandlineUtility } from "../Utilities";
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
