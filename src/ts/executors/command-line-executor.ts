import { spawn } from "child_process";
import { ipcMain } from "electron";
import { CommandLineHelpers } from "./../helpers/command-line-helpers";
import { Executor } from "./executor";
import { IpcChannels } from "../ipc-channels";

export class CommandLineExecutor implements Executor {
    public hideAfterExecution = false;
    public resetUserInputAfterExecution = true;
    public logExecution = false;

    public execute(executionArgument: string): void {
        const command = CommandLineHelpers.buildCommand(executionArgument);

        const commandLineTool = spawn(command.name, command.args);

        const commandLineToolStartedMessage = (command.args !== undefined && command.args.length > 0)
            ? `Started "${command.name}" with parameters: ${command.args.map((c): string => `"${c}"`).join(", ")}`
            : `Started "${command.name}"`;

        this.sendCommandLineOutputToRenderer(commandLineToolStartedMessage);

        commandLineTool.on("error", (err): void => {
            this.sendCommandLineOutputToRenderer(err.message);
        });

        commandLineTool.stderr.on("data", (data): void => {
            this.sendCommandLineOutputToRenderer(data.toString());
        });

        commandLineTool.stdout.on("data", (data): void => {
            this.sendCommandLineOutputToRenderer(data.toString());
        });

        commandLineTool.on("exit", (code): void => {
            this.sendCommandLineOutputToRenderer(`Exit ${code} `);
        });

        ipcMain.on(IpcChannels.exitCommandLineTool, (): void => {
            commandLineTool.kill();
        });
    }

    private sendCommandLineOutputToRenderer(data: string): void {
        ipcMain.emit(IpcChannels.commandLineExecution, data);
    }
}
