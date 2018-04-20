import { Injector } from "../injector";
import { ExecutionArgumentValidator } from "./execution-argument-validator";
import { platform } from "os";

export class FilePathExecutionArgumentValidator implements ExecutionArgumentValidator {
    public isValidForExecution(executionArgument: string): boolean {
        const regex = Injector.getFilePathRegExp(platform());
        return regex.test(executionArgument);
    }
}
