import { Injector } from "../injector";
import { ExecutionArgumentValidator } from "./execution-argument-validator";

export class WebUrlExecutionArgumentValidator implements ExecutionArgumentValidator {
    public isValidForExecution(executionArgument: string): boolean {
        const regex = Injector.getWebUrlRegExp();
        return regex.test(executionArgument);
    }
}
