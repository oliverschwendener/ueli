import { Calculator } from "../../../ts/calculator/calculator";
import { InputOutputCombination } from "../test-helpers";

describe(Calculator.name, () => {
    describe(Calculator.calculate.name, () => {
        it("should return the correct result", () => {
            const inputOutputCombinations: InputOutputCombination[] = [
                {
                    input: "1.1 - 1",
                    output: "0.1",
                },
                {
                    input: "[[1,2,3] * 2, [4,5,6]] + [[6,7,8],[9,10,11]]",
                    output: "[[8, 11, 14], [13, 15, 17]]",
                },
                {
                    input: "pow(2,6) == 2^(re(10i + 6))",
                    output: "true",
                },
            ];

            inputOutputCombinations.forEach((combination) => {
                const actual = Calculator.calculate(combination.input);
                const expected = combination.output;
                expect(actual).toBe(expected);
            });
        });
    });

    describe(Calculator.isValidInput.name, () => {
        it("should return true if input is valid", () => {
            const validInputs = [
                "1 + 2",
                "(7 * pi / 53 ^2) * sqrt(9)",
            ];

            validInputs.forEach((validInput) => {
                const actual = Calculator.isValidInput(validInput);
                expect(actual).toBe(true);
            });
        });

        it("should return false when input is invalid", () => {
            const invalidInputs: string[] = [
                "1 + 2_",
                "abc",
                "",
            ];

            invalidInputs.forEach((invalidInput) => {
                const actual = Calculator.isValidInput(invalidInput);
                expect(actual).toBe(false);
            });
        });
    });
});
