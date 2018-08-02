import { ExecutionArgumentValidator } from "./execution-argument-validator";
import { StringHelpers } from "../helpers/string-helpers";

export class EmailAddressExecutionArgumentValidator implements ExecutionArgumentValidator {
    public isValidForExecution(executionArgument: string): boolean {
        executionArgument = executionArgument.replace("mailto:", "");
        return StringHelpers.isValidEmailAddress(executionArgument);
    }
}
