import { Executor } from "./executor";
import { ipcMain } from "electron";
import { SearchResultItem } from "../search-engine";
import { spawn } from "child_process";

export class CommandLineExecutor implements Executor {
    private prefix = ">";
    private icon = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 32 32" version="1.1">
                        <g id="surface1">
                            <path d="M 4 5 L 4 27 L 28 27 L 28 5 Z M 6 7 L 26 7 L 26 9 L 6 9 Z M 6 11 L 26 11 L 26 25 L 6 25 Z M 11.21875 13.78125 L 9.78125 15.21875 L 12.5625 18 L 9.78125 20.78125 L 11.21875 22.21875 L 14.71875 18.71875 L 15.40625 18 L 14.71875 17.28125 Z M 16 20 L 16 22 L 22 22 L 22 20 Z "></path>
                        </g>
                    </svg>`;

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

    public isValidForExecution(executionArgument: string): boolean {
        return executionArgument.startsWith(this.prefix)
            && executionArgument.length > this.prefix.length;
    }

    public hideAfterExecution(): boolean {
        return false;
    }

    public getSearchResult(userInput: string): SearchResultItem[] {
        let command = this.replacePrefix(userInput);

        return [
            <SearchResultItem>{
                name: `Execute ${command}`,
                executionArgument: userInput,
                icon: this.icon,
                tags: []
            }
        ];
    }

    private replacePrefix(executionArgument: string): string {
        return executionArgument.replace(">", "");
    }

    private buildCommand(executionArgument: string): Command {
        let words = executionArgument.split(/\s+/g);
        let command = this.replacePrefix(words[0]);
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