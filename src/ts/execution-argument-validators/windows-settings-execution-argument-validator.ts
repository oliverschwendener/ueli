import { Config } from "../config";
import { ExecutionArgumentValidator } from "./execution-argument-validator";

export class WindowsSettingsExecutionArgumentValidator implements ExecutionArgumentValidator {
    public isValidForExecution(executionArgument: string): boolean {
        return executionArgument.startsWith(Config.windowsSettingsPrefix)
            && executionArgument.length > Config.windowsSettingsPrefix.length;
    }
}
