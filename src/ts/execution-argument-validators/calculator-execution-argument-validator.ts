import { ExecutionArgumentValidator } from "./execution-argument-validator";
import { CalculatorHelper } from "../helpers/calculator-helper";

export class CalculatorExecutionArgumentValidator implements ExecutionArgumentValidator {
    public isValidForExecution(executionArgument: string): boolean {
        const prefix = CalculatorHelper.getExecutionArgumentPrefix;

        return executionArgument.startsWith(prefix)
            && executionArgument.length > prefix.length;
    }
}
