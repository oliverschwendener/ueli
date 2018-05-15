import { ExecutionArgumentValidator } from "./execution-argument-validator";
import { MacOsSettingsHelpers } from "../helpers/mac-os-settings.helpers";

export class MacOsSettingsExecutionArgumentValidator implements ExecutionArgumentValidator {
    public isValidForExecution(executionArgument: string): boolean {
        return executionArgument.startsWith(MacOsSettingsHelpers.macOsSettingsPrefix)
            && executionArgument.length > MacOsSettingsHelpers.macOsSettingsPrefix.length;
    }
}
