import * as childProcess from "child_process";
import { Injector } from "./injector";
import { ipcMain } from "electron";
import { Executor } from "./executors/executor";
import { ElectronizrCommandExecutor } from "./executors/electronizr-command-executor";
import { WebUrlExecutor } from "./executors/web-url-executor";
import { FilePathExecutor } from "./executors/file-path-executor";

export class ExecutionService {
    private executors: Executor[];

    constructor() {
        this.executors = [
            new FilePathExecutor(),
            new ElectronizrCommandExecutor(),
            new WebUrlExecutor()
        ];
    }

    public execute(executionArgument: string): void {
        for (let executor of this.executors) {
            if (executor.isValidForExecution(executionArgument)) {
                executor.execute(executionArgument);
                return;
            }
        }

        throw new Error(`This argument (${executionArgument}) is not supported`);
    }
}