export interface Executor {
    execute(executionArgument: string): void;
    isValidForExecution(executionArgument: string): boolean;
    hideAfterExecution(): boolean;
}