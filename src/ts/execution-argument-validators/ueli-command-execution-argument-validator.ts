import { Config } from "../config";
import { ExecutionArgumentValidator } from "./execution-argument-validator";

export class UeliCommandExecutionArgumentValidator implements ExecutionArgumentValidator {
    public isValidForExecution(executionArgument: string): boolean {
        const prefix = Config.ueliCommandPrefix;

        return executionArgument.startsWith(prefix)
            && executionArgument.length > prefix.length;
    }
}
