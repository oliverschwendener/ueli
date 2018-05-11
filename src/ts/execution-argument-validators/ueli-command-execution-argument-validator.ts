import { ExecutionArgumentValidator } from "./execution-argument-validator";
import { UeliHelpers } from "../helpers/ueli-helpers";

export class UeliCommandExecutionArgumentValidator implements ExecutionArgumentValidator {
    public isValidForExecution(executionArgument: string): boolean {
        return executionArgument.startsWith(UeliHelpers.ueliCommandPrefix)
            && executionArgument.length > UeliHelpers.ueliCommandPrefix.length;
    }
}
