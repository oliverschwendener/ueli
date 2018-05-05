import * as childProcess from "child_process";
import { Injector } from "../injector";
import { Executor } from "./executor";
import { platform } from "os";
import { WeightManager } from "../weight-manager";

export class FilePathExecutor implements Executor {
    public execute(filePath: string): void {
        WeightManager.addWeightScore(filePath);
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

    private handleExecution(command: string): void {
        childProcess.exec(command, (err, stoud, sterr) => {
            if (err) {
                throw err;
            }
        });
    }
}
