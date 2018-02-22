import * as childProcess from "child_process";
import { Injector } from "../injector";
import { Executor } from "./executor";

export class FilePathExecutor implements Executor {
    public execute(filePath: string): void {
        const command = Injector.getFileExecutionCommand(filePath);
        this.handleExecution(command);
    }

    public hideAfterExecution(): boolean {
        return true;
    }

    public openFileLocation(filePath: string): void {
        const command = Injector.getFileLocationExecutionCommand(filePath);
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
