export interface ExecutionArgumentValidator {
    isValidForExecution(executionArgument: string): boolean;
}
