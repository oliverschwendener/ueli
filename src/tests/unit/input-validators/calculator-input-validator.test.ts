import { CalculatorInputValidator } from "../../../ts/input-validators/calculator-input-validator";

describe(CalculatorInputValidator.name, (): void => {
    const validator = new CalculatorInputValidator();

    describe(validator.isValidForSearchResults.name, (): void => {
        it("should return true when passing in a valid argument", (): void => {
            const validInputs = [
                "10",
                "23 * 24 / 2 + (6 * 7) ^ 2",
                "1 hundredweight to ton",
                "sqrt(pi * 2) / sin(e)",
                "[[1,2,3] * 2, [4,5,6]] + [[6,7,8],[9,10,11]]",
                "a = 2; b = 3; c = a / b; [a, b, c]",
                "pow(2,6) == 2^(re(10i + 6))",
            ];

            for (const validInput of validInputs) {
                const actual = validator.isValidForSearchResults(validInput);
                expect(actual).toBe(true);
            }
        });

        it("should return false when passing in an invalid argument", (): void => {
            const invalidInputs = [
                "s",
                "kg",
                "log()",
                "1 blackhole to mg",
                "random-string",
            ];

            for (const invalidInput of invalidInputs) {
                const actual = validator.isValidForSearchResults(invalidInput);
                expect(actual).toBe(false);
            }
        });
    });
});
