import * as childProcess from "child_process";
import { Injector } from "./injector";
import { ipcMain } from "electron";
import { Executor } from "./executors/executor";
import { ElectronizrCommandExecutor } from "./executors/electronizr-command-executor";
import { WebUrlExecutor } from "./executors/web-url-executor";
import { FilePathExecutor } from "./executors/file-path-executor";
import { CommandLineExecutor } from "./executors/command-line-executor";
import { Config } from "./config";
import { InputExecutionDictionaryItem } from "./helpers/input-execution-dictionary";
import { CommandLineExecutionArgumentValidator } from "./execution-argument-validators/command-line-execution-argument-validator";
import { ElectronizrCommandExecutionArgumentValidator } from "./execution-argument-validators/electronizr-command-execution-argument-validator";
import { FilePathExecutionArgumentValidator } from "./execution-argument-validators/file-path-execution-argument-validator";
import { WebSearchExecutionArgumentValidator } from "./execution-argument-validators/web-search-execution-argument-validator";
import { WebSearchExecutor } from "./executors/web-search-executor";
import { WebUrlExecutionArgumentValidator } from "./execution-argument-validators/web-url-execution-argument-validator";
import { ExecutionArgumentValidator } from "./execution-argument-validators/execution-argument-validator";

export class ExecutionService {
    private validatorExecutorCombinations = [
        <ValidatorExecutorCombination>{
            validator: new CommandLineExecutionArgumentValidator(),
            executor: new CommandLineExecutor()
        },
        <ValidatorExecutorCombination>{
            validator: new ElectronizrCommandExecutionArgumentValidator(),
            executor: new ElectronizrCommandExecutor()
        },
        <ValidatorExecutorCombination>{
            validator: new FilePathExecutionArgumentValidator(),
            executor: new FilePathExecutor()
        },
        <ValidatorExecutorCombination>{
            validator: new WebSearchExecutionArgumentValidator(),
            executor: new WebSearchExecutor()
        },
        <ValidatorExecutorCombination>{
            validator: new WebUrlExecutionArgumentValidator(),
            executor: new WebUrlExecutor()
        }
    ];

    public execute(executionArgument: string): void {
        for (let combi of this.validatorExecutorCombinations) {
            if (combi.validator.isValidForExecution(executionArgument)) {
                combi.executor.execute(executionArgument);

                if (combi.executor.hideAfterExecution()) {
                    ipcMain.emit("hide-window");
                }

                return;
            }
        }

        throw new Error(`This argument (${executionArgument}) is not supported by the execution service`);
    }
}

class ValidatorExecutorCombination {
    public validator: ExecutionArgumentValidator;
    public executor: Executor;
}