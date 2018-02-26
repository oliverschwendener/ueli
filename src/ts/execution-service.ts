import * as childProcess from "child_process";
import { ipcMain } from "electron";
import { Config } from "./config";
import { CommandLineExecutionArgumentValidator } from "./execution-argument-validators/command-line-execution-argument-validator";
import { ElectronizrCommandExecutionArgumentValidator } from "./execution-argument-validators/electronizr-command-execution-argument-validator";
import { ExecutionArgumentValidator } from "./execution-argument-validators/execution-argument-validator";
import { FilePathExecutionArgumentValidator } from "./execution-argument-validators/file-path-execution-argument-validator";
import { WebSearchExecutionArgumentValidator } from "./execution-argument-validators/web-search-execution-argument-validator";
import { WebUrlExecutionArgumentValidator } from "./execution-argument-validators/web-url-execution-argument-validator";
import { WindowsSettingsExecutionArgumentValidator } from "./execution-argument-validators/windows-settings-execution-argument-validator";
import { CommandLineExecutor } from "./executors/command-line-executor";
import { ElectronizrCommandExecutor } from "./executors/electronizr-command-executor";
import { Executor } from "./executors/executor";
import { FilePathExecutor } from "./executors/file-path-executor";
import { WebSearchExecutor } from "./executors/web-search-executor";
import { WebUrlExecutor } from "./executors/web-url-executor";
import { WindowsSettingsExecutor } from "./executors/windows-settings-executor";
import { Injector } from "./injector";
import { OperatingSystem } from "./operating-system";
import { ValidatorExecutorCombination } from "./validator-executor-combination";
import { IpcChannels } from "./ipc-channels";

export class ExecutionService {
    private validatorExecutorCombinations = [
        {
            executor: new CommandLineExecutor(),
            validator: new CommandLineExecutionArgumentValidator(),
        },
        {
            executor: new ElectronizrCommandExecutor(),
            validator: new ElectronizrCommandExecutionArgumentValidator(),
        },
        {
            executor: new FilePathExecutor(),
            validator: new FilePathExecutionArgumentValidator(),
        },
        {
            executor: new WebSearchExecutor(),
            validator: new WebSearchExecutionArgumentValidator(),
        },
        {
            executor: new WebUrlExecutor(),
            validator: new WebUrlExecutionArgumentValidator(),
        },
    ] as ValidatorExecutorCombination[];

    constructor() {
        if (Injector.getCurrentOperatingSystem() === OperatingSystem.Windows) {
            this.validatorExecutorCombinations.push(
                {
                    executor: new WindowsSettingsExecutor(),
                    validator: new WindowsSettingsExecutionArgumentValidator(),
                } as ValidatorExecutorCombination,
            );
        }
    }

    public execute(executionArgument: string): void {
        for (const combi of this.validatorExecutorCombinations) {
            if (combi.validator.isValidForExecution(executionArgument)) {
                combi.executor.execute(executionArgument);

                if (combi.executor.hideAfterExecution()) {
                    ipcMain.emit(IpcChannels.hideWindow);
                }

                return;
            }
        }

        throw new Error(`This argument (${executionArgument}) is not supported by the execution service`);
    }
}
