import { ExecutionArgumentValidator } from "./execution-argument-validator";
import { Injector } from "../injector";

export class WebUrlExecutionArgumentValidator implements ExecutionArgumentValidator {
    public isValidForExecution(executionArgument: string): boolean {
        let regex = Injector.getWebUrlRegExp();
        return regex.test(executionArgument);
    }
}