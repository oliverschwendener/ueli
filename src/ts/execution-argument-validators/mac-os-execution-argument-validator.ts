import { ExecutionArgumentValidator } from "./execution-argument-validator";

export class MacOsSettingsExecutionArgumentValidator implements ExecutionArgumentValidator {
    public isValidForExecution(executionArgument: string): boolean {
        return false;
    }
}
