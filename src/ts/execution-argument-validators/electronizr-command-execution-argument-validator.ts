import { Config } from "../config";
import { ExecutionArgumentValidator } from "./execution-argument-validator";

export class ElectronizrCommandExecutionArgumentValidator implements ExecutionArgumentValidator {
    public isValidForExecution(executionArgument: string): boolean {
        const prefix = Config.electronizrCommandPrefix;

        return executionArgument.startsWith(prefix)
            && executionArgument.length > prefix.length;
    }
}
