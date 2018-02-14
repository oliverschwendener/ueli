import { ExecutionArgumentValidator } from "./execution-argument-validator";
import { Injector } from "../injector";

export class FilePathExecutionArgumentValidator implements ExecutionArgumentValidator {
    public isValidForExecution(executionArgument: string): boolean {
        let regex = Injector.getFilePathRegExp();
        return regex.test(executionArgument);
    }
}