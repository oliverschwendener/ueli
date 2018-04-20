export class ExecutionArgumentNotSupportedError extends Error {
    constructor(executionArgument: string) {
        super(`This argument (${executionArgument}) is not supported by the execution service`);
    }
}
