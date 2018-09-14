import { CalculatorExecutionArgumentValidator } from "../../../ts/execution-argument-validators/calculator-execution-argument-validator";
import { CalculatorHelper } from "../../../ts/helpers/calculator-helper";

describe(CalculatorExecutionArgumentValidator.name, (): void => {
    const validator = new CalculatorExecutionArgumentValidator();

    describe(validator.isValidForExecution.name, (): void => {
        it("should return true when passing in a valid execution argument", (): void => {
            const validExecutionArguments = [
                `${CalculatorHelper.getExecutionArgumentPrefix} 1`,
                `${CalculatorHelper.getExecutionArgumentPrefix} 1kg`,
                `${CalculatorHelper.getExecutionArgumentPrefix} something`,
                `${CalculatorHelper.getExecutionArgumentPrefix} bla bla`,
            ];

            for (const validExecutionArgument of validExecutionArguments) {
                const result = validator.isValidForExecution(validExecutionArgument);
                expect(result).toBe(true);
            }
        });

        it("should return false when passing in an invalid execution argument", (): void => {
            const invalidExecutionArguments = [
                "",
                "   ",
                "something",
                "result: shit",
                `${CalculatorHelper.getExecutionArgumentPrefix}`,
            ];

            for (const invalidExecutionArgument of invalidExecutionArguments) {
                const result = validator.isValidForExecution(invalidExecutionArgument);
                expect(result).toBe(false);
            }
        });
    });
});
