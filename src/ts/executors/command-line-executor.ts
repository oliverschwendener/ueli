import { Executor } from "./executor";
import { ipcMain } from "electron";
import { SearchResultItem } from "../search-engine";
import { spawn } from "child_process";
import { Config } from "../config";
import { CommandLineHelpers } from "../helpers/command-line-helpers";

export class CommandLineExecutor implements Executor {
    public execute(executionArgument: string): void {
        let command = CommandLineHelpers.buildCommand(executionArgument);

        let commandLineTool = spawn(command.name, command.args);

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

        ipcMain.on("exit-command-line-tool", () => {
            commandLineTool.kill();
        });
    }

    private sendCommandLineOutputToRenderer(data: string): void {
        ipcMain.emit("command-line-execution", data);
    }

    public hideAfterExecution(): boolean {
        return false;
    }
}