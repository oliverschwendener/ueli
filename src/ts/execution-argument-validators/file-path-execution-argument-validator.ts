import { Injector } from "../injector";
import { ExecutionArgumentValidator } from "./execution-argument-validator";

export class FilePathExecutionArgumentValidator implements ExecutionArgumentValidator {
    public isValidForExecution(executionArgument: string): boolean {
        const regex = Injector.getFilePathRegExp();
        return regex.test(executionArgument);
    }
}
