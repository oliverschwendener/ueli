import { ExecutionArgumentValidatorExecutorCombination } from "./execution-argument-validator-executor-combination";
import { CountManager } from "./count/count-manager";
import { UserConfigOptions } from "./user-config/user-config-options";
import { IpcEmitter } from "./ipc-emitter";

export class ExecutionService {
    private readonly validatorExecutorCombinations: ExecutionArgumentValidatorExecutorCombination[];
    private countManager: CountManager;
    private config: UserConfigOptions;
    private ipcEmitter: IpcEmitter;

    public constructor(validatorExecutorCombinations: ExecutionArgumentValidatorExecutorCombination[], countManager: CountManager, config: UserConfigOptions, ipcEmitter: IpcEmitter) {
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
