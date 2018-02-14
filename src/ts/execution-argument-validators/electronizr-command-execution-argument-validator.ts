import { ExecutionArgumentValidator } from "./execution-argument-validator";
import { Config } from "../config";

export class ElectronizrCommandExecutionArgumentValidator implements ExecutionArgumentValidator {
    public isValidForExecution(executionArgument: string): boolean {
        let prefix = Config.electronizrCommandPrefix;
        
        return executionArgument.startsWith(prefix)
            && executionArgument.length > prefix.length;
    }
}