import { ExecutionArgumentValidator } from "./execution-argument-validator";
import { WindowsSettingsHelpers } from "../helpers/windows-settings-helpers";

export class WindowsSettingsExecutionArgumentValidator implements ExecutionArgumentValidator {
    public isValidForExecution(executionArgument: string): boolean {
        return executionArgument.startsWith(WindowsSettingsHelpers.windowsSettingsPrefix)
            && executionArgument.length > WindowsSettingsHelpers.windowsSettingsPrefix.length;
    }
}
