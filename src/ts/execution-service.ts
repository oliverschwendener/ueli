import { ExecutionArgumentValidatorExecutorCombination } from "./execution-argument-validator-executor-combination";
import { CountManager } from "./count/count-manager";
import { UserConfigOptions } from "./user-config/user-config-options";
import { IpcEmitter } from "./ipc-emitter";

export class ExecutionService {
    private readonly validatorExecutorCombinations: ExecutionArgumentValidatorExecutorCombination[];
    private readonly validatorAdminExecutorCombinations: ExecutionArgumentValidatorExecutorCombination[];
    private readonly countManager: CountManager;
    private readonly config: UserConfigOptions;
    private readonly ipcEmitter: IpcEmitter;

    public constructor(
        validatorExecutorCombinations: ExecutionArgumentValidatorExecutorCombination[],
        validatorAdminExecutorCombinations: ExecutionArgumentValidatorExecutorCombination[],
        countManager: CountManager,
        config: UserConfigOptions,
        ipcEmitter: IpcEmitter) {
        this.config = config;
        this.validatorExecutorCombinations = validatorExecutorCombinations;
        this.validatorAdminExecutorCombinations = validatorAdminExecutorCombinations;
        this.countManager = countManager;
        this.ipcEmitter = ipcEmitter;
    }

    public execute(executionArgument: string): void {
        this.handleExecution(this.validatorExecutorCombinations, executionArgument);
    }

    public executeAsAdmin(executionArgument: string): void {
        this.handleExecution(this.validatorAdminExecutorCombinations, executionArgument);
    }

    private handleExecution(combinations: ExecutionArgumentValidatorExecutorCombination[], executionArgument: string) {
        for (const combi of combinations) {
            if (combi.validator.isValidForExecution(executionArgument)) {
                if (combi.executor.resetUserInputAfterExecution) {
                    this.ipcEmitter.emitResetUserInput();
                }

                if (combi.executor.logExecution && this.config.logExecution) {
                    this.countManager.increaseCount(executionArgument);
                }

                if (combi.executor.hideAfterExecution) {
                    this.ipcEmitter.emitHideWindow();
                }

                combi.executor.execute(executionArgument);

                return;
            }
        }
    }
}
