import { spawn } from "child_process";
import { ipcMain } from "electron";
import { CommandLineHelpers } from "./../helpers/command-line-helpers";
import { Executor } from "./executor";
import { IpcChannels } from "../ipc-channels";

export class CommandLineExecutor implements Executor {
    public execute(executionArgument: string): void {
        const command = CommandLineHelpers.buildCommand(executionArgument);

        const commandLineTool = spawn(command.name, command.args);

        const commandLineToolStartedMessage = (command.args !== undefined && command.args.length > 0)
            ? `Started "${command.name}" with parameters: ${command.args.map((c) => `"${c}"`).join(", ")}`
            : `Started "${command.name}"`;

        this.sendCommandLineOutputToRenderer(commandLineToolStartedMessage);

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
            this.sendCommandLineOutputToRenderer(`Exit ${code} `);
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

    public logExecution(): boolean {
        return false;
    }

    private sendCommandLineOutputToRenderer(data: string): void {
        ipcMain.emit(IpcChannels.commandLineExecution, data);
    }

}
