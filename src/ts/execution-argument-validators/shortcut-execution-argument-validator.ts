import { ExecutionArgumentValidator } from "./execution-argument-validator";
import { UeliHelpers } from "../helpers/ueli-helpers";

export class ShortcutExecutionArgumentValidator implements ExecutionArgumentValidator {
    public isValidForExecution(executionArgument: string): boolean {
        return executionArgument.length > UeliHelpers.shortcutPrefix.length
            && executionArgument.startsWith(UeliHelpers.shortcutPrefix);
    }
}
