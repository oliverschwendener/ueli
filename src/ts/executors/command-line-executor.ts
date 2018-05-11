import { spawn } from "child_process";
import { ipcMain } from "electron";
import { CommandLineHelpers } from "./../helpers/command-line-helpers";
import { Executor } from "./executor";
import { IpcChannels } from "../ipc-channels";

export class CommandLineExecutor implements Executor {
    public execute(executionArgument: string): void {
        const command = CommandLineHelpers.buildCommand(executionArgument);

        const commandLineTool = spawn(command.name, command.args);

        commandLineTool.on("error", (err) => {
            this.sendCommandLineOutputToRenderer(err.message);
        });

        commandLineTool.stderr.on("data", (data) => {
            this.sendCommandLineOutputToRenderer(data.toString());
        });

        commandLineTool.stdout.on("data", (data) => {
            this.sendCommandLineOutputToRenderer(data.toString());
        });

        commandLineTool.on("exit", (code) => {
            this.sendCommandLineOutputToRenderer(`Exit ${code}`);
        });

        ipcMain.on(IpcChannels.exitCommandLineTool, () => {
            commandLineTool.kill();
        });
    }

    public hideAfterExecution(): boolean {
        return false;
    }

    public resetUserInputAfterExecution(): boolean {
        return true;
    }

    private sendCommandLineOutputToRenderer(data: string): void {
        ipcMain.emit(IpcChannels.commandLineExecution, data);
    }
}
