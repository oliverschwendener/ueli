import { exec } from "child_process";
import { Injector } from "../injector";
import { Executor } from "./executor";
import { platform } from "os";

export class FilePathExecutor implements Executor {
    public readonly hideAfterExecution = true;
    public readonly resetUserInputAfterExecution = true;
    public readonly logExecution = true;

    public execute(filePath: string): void {
        const command = Injector.getFileExecutionCommand(platform(), filePath);
        this.handleExecution(command);
    }

    public openFileLocation(filePath: string): void {
        const command = Injector.getFileLocationExecutionCommand(platform(), filePath);
        this.handleExecution(command);
    }

    private handleExecution(command: string): void {
        exec(command, (err): void => {
            if (err) {
                throw err;
            }
        });
    }
}
