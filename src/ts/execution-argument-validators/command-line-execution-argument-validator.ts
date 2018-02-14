import { ExecutionArgumentValidator } from "./execution-argument-validator";
import { Config } from "../config";

export class CommandLineExecutionArgumentValidator implements ExecutionArgumentValidator {

    public isValidForExecution(executionArgument: string): boolean {
        let commandLinePrefix = Config.commandLinePrefix;
        
        return executionArgument.startsWith(commandLinePrefix)
            && executionArgument.length > commandLinePrefix.length;
    }
}