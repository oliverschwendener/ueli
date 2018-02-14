import * as childProcess from "child_process";
import { Executor } from "./executor";
import { Injector } from "../injector";

export class FilePathExecutor implements Executor {
    public execute(filePath: string): void {
        let command = Injector.getFileExecutionCommand(filePath);
        this.handleExecution(command);
    }

    public hideAfterExecution(): boolean {
        return true;
    }

    public openFileLocation(filePath: string): void {
        let command = Injector.getFileLocationExecutionCommand(filePath);
        this.handleExecution(command);
    }

    private handleExecution(command: string): void {
        childProcess.exec(command, (err, stoud, sterr) => {
            if (err) {
                throw err;
            }
        });
    }
}