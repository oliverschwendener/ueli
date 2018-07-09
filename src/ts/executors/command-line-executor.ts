import { spawn } from "child_process";
import { ipcMain } from "electron";
import { CommandLineHelpers } from "./../helpers/command-line-helpers";
import { Executor } from "./executor";
import { IpcChannels } from "../ipc-channels";

export class CommandLineExecutor implements Executor {
    private encoding = "utf8";

    public execute(executionArgument: string): void {
        const command = CommandLineHelpers.buildCommand(executionArgument);

        const commandLineTool = spawn(command.name, command.args);

        this.sendCommandLineOutputToRenderer(`Started "${command.name}" with parameters: ${command.args.map((c) => `"${c}"`).join(", ")}`);

        commandLineTool.stderr.setEncoding(this.encoding);
        commandLineTool.stdout.setEncoding(this.encoding);

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
