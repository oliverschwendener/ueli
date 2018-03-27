import { Config } from "../config";
import { ExecutionArgumentValidator } from "./execution-argument-validator";

export class CommandLineExecutionArgumentValidator implements ExecutionArgumentValidator {

    public isValidForExecution(executionArgument: string): boolean {
        const commandLinePrefix = Config.commandLinePrefix;

        return executionArgument.startsWith(commandLinePrefix)
            && executionArgument.length > commandLinePrefix.length;
    }
}
