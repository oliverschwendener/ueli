export interface AutoCompletionValidator {
    isValidForAutoCompletion(executionArgument: string): boolean;
    getAutoCompletionResult(executionArgument: string): string;
}
