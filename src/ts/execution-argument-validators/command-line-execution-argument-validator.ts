import { ExecutionArgumentValidator } from "./execution-argument-validator";
import { CommandLineHelpers } from "../helpers/command-line-helpers";

export class CommandLineExecutionArgumentValidator implements ExecutionArgumentValidator {

    public isValidForExecution(executionArgument: string): boolean {
        const commandLinePrefix = CommandLineHelpers.commandLinePrefix;

        return executionArgument.startsWith(commandLinePrefix)
            && executionArgument.length > commandLinePrefix.length;
    }
}
