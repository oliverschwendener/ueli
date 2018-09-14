import { Executor } from "./executor";
import { CalculatorHelper } from "../helpers/calculator-helper";
import { StringHelpers } from "../helpers/string-helpers";
import { writeSync } from "clipboardy";

export class CalculatorExecutor implements Executor {
    public execute(executionArgument: string): void {
        const prefix = CalculatorHelper.getExecutionArgumentPrefix;
        const result = StringHelpers.removeWhiteSpace(executionArgument.replace(prefix, ""));
        writeSync(result);
    }

    public hideAfterExecution(): boolean {
        return true;
    }

    public resetUserInputAfterExecution(): boolean {
        return true;
    }

    public logExecution(): boolean {
        return true;
    }
}
