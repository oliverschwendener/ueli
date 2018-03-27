import { CommandLineExecutionArgumentValidator } from "../../../ts/execution-argument-validators/command-line-execution-argument-validator";

describe(CommandLineExecutionArgumentValidator.name, (): void => {
    const validator = new CommandLineExecutionArgumentValidator();

    describe(validator.isValidForExecution.name, (): void => {
        it("should return true when passing in a valid argument", (): void => {
            const validInputs = [
                ">ipconfig",
                ">ipconfig /flushdns",
                ">do some shit",
            ];

            for (const validInput of validInputs) {
                const actual = validator.isValidForExecution(validInput);
                expect(actual).toBe(true);
            }
        });

        it("should return false when passing in an invalid argument", (): void => {
            const invalidInputs = [
                ">",
                "ipconfig",
                "<ipconfig",
            ];

            for (const invalidInput of invalidInputs) {
                const actual = validator.isValidForExecution(invalidInput);
                expect(actual).toBe(false);
            }
        });
    });
});
