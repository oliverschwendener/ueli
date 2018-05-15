import * as childProcess from "child_process";
import { Injector } from "../injector";
import { Executor } from "./executor";
import { platform } from "os";

export class FilePathExecutor implements Executor {
    public execute(filePath: string): void {
        const command = Injector.getFileExecutionCommand(platform(), filePath);
        this.handleExecution(command);
    }

    public hideAfterExecution(): boolean {
        return true;
    }

    public resetUserInputAfterExecution(): boolean {
        return true;
    }

    public openFileLocation(filePath: string): void {
        const command = Injector.getFileLocationExecutionCommand(platform(), filePath);
        this.handleExecution(command);
    }

    public logExecution(): boolean {
        return true;
    }

    private handleExecution(command: string): void {
        childProcess.exec(command, (err, stoud, sterr) => {
            if (err) {
                throw err;
            }
        });
    }
}
