export interface Executor {
    execute(executionArgument: string): void;
    hideAfterExecution(): boolean;
    resetUserInputAfterExecution(): boolean;
    logExecute(): boolean;
}
