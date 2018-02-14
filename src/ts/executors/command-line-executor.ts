import { Executor } from "./executor";
import { ipcMain } from "electron";
import { SearchResultItem } from "../search-engine";
import { spawn } from "child_process";
import { Config } from "../config";

export class CommandLineExecutor implements Executor {
    public execute(executionArgument: string): void {
        let command = this.buildCommand(executionArgument);

        let commandLineTool = spawn(command.command, command.args);

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
            console.log(`Exit ${code}`);
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

    private buildCommand(executionArgument: string): Command {
        let words = executionArgument.split(/\s+/g);
        let command = words[0].replace(Config.commandLinePrefix, "");
        let args = [] as string[];

        for (let i = 0; i < words.length; i++) {
            if (i === 0) {
                continue;
            }

            args.push(words[i]);
        }

        return <Command>{
            command: command,
            args: args
        };
    }
}

class Command {
    public command: string;
    public args: string[];
}