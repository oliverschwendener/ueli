import { Executor } from "./executor";
import { CalculatorHelper } from "../helpers/calculator-helper";
import { StringHelpers } from "../helpers/string-helpers";
import { clipboard } from "electron";

export class CalculatorExecutor implements Executor {
    public readonly hideAfterExecution = true;
    public readonly resetUserInputAfterExecution = true;
    public readonly logExecution = true;

    public execute(executionArgument: string): void {
        const prefix = CalculatorHelper.getExecutionArgumentPrefix;
        const result = StringHelpers.removeWhiteSpace(executionArgument.replace(prefix, ""));
        clipboard.writeText(result);
    }
}
