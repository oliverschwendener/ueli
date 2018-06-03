import { CommandLineExecutionArgumentValidator } from "./execution-argument-validators/command-line-execution-argument-validator";
import { UeliCommandExecutionArgumentValidator } from "./execution-argument-validators/ueli-command-execution-argument-validator";
import { ExecutionArgumentValidator } from "./execution-argument-validators/execution-argument-validator";
import { FilePathExecutionArgumentValidator } from "./execution-argument-validators/file-path-execution-argument-validator";
import { WebSearchExecutionArgumentValidator } from "./execution-argument-validators/web-search-execution-argument-validator";
import { WebUrlExecutionArgumentValidator } from "./execution-argument-validators/web-url-execution-argument-validator";
import { CommandLineExecutor } from "./executors/command-line-executor";
import { UeliCommandExecutor } from "./executors/ueli-command-executor";
import { Executor } from "./executors/executor";
import { FilePathExecutor } from "./executors/file-path-executor";
import { WebSearchExecutor } from "./executors/web-search-executor";
import { WebUrlExecutor } from "./executors/web-url-executor";
import { Injector } from "./injector";
import { OperatingSystem } from "./operating-system";
import { ExecutionArgumentValidatorExecutorCombination } from "./execution-argument-validator-executor-combination";
import { IpcChannels } from "./ipc-channels";
import { EmailAddressInputValidator } from "./input-validators/email-address-input-validator";
import { EmailAddressExecutionArgumentValidator } from "./execution-argument-validators/email-address-execution-argument-validator";
import { platform } from "os";
import { CountManager } from "./count-manager";
import { ConfigOptions } from "./config-options";
import { IpcEmitter } from "./ipc-emitter";

export class ExecutionService {
    private validatorExecutorCombinations: ExecutionArgumentValidatorExecutorCombination[];
    private countManager: CountManager;
    private config: ConfigOptions;
    private ipcEmitter: IpcEmitter;

    public constructor(validatorExecutorCombinations: ExecutionArgumentValidatorExecutorCombination[], countManager: CountManager, config: ConfigOptions, ipcEmitter: IpcEmitter) {
        this.config = config;
        this.validatorExecutorCombinations = validatorExecutorCombinations;
        this.countManager = countManager;
        this.ipcEmitter = ipcEmitter;
    }

    public execute(executionArgument: string): void {
        for (const combi of this.validatorExecutorCombinations) {
            if (combi.validator.isValidForExecution(executionArgument)) {
                if (combi.executor.resetUserInputAfterExecution()) {
                    this.ipcEmitter.emitResetUserInput();
                }

                if (combi.executor.logExecution() && this.config.logExecution) {
                    this.countManager.increaseCount(executionArgument);
                }

                if (combi.executor.hideAfterExecution()) {
                    this.ipcEmitter.emitHideWindow();
                }

                combi.executor.execute(executionArgument);

                return;
            }
        }
    }
}
