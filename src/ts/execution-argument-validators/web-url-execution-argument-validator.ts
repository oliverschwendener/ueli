import { ExecutionArgumentValidator } from "./execution-argument-validator";
import { StringHelpers } from "../helpers/string-helpers";

export class WebUrlExecutionArgumentValidator implements ExecutionArgumentValidator {
    public isValidForExecution(executionArgument: string): boolean {
        return StringHelpers.isValidUrl(executionArgument);
    }
}
