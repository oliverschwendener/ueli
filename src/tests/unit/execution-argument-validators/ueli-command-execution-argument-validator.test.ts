import { UeliCommandExecutionArgumentValidator } from "../../../ts/execution-argument-validators/ueli-command-execution-argument-validator";

describe(UeliCommandExecutionArgumentValidator.name, (): void => {
    const validator = new UeliCommandExecutionArgumentValidator();

    describe(validator.isValidForExecution.name, (): void => {
        it("should return true when passing in a valid argument", (): void => {
            const validInputs = [
                "ueli:reload",
                "ueli:exit",
                "ueli:do-something",
            ];

            for (const validInput of validInputs) {
                const actual = validator.isValidForExecution(validInput);
                expect(actual).toBe(true);
            }
        });

        it("should return false when passing in an invalid argument", (): void => {
            const invalidInputs = [
                "ueli",
                "ueli:",
                "er:do-something",
                "bla bla",
            ];

            for (const invalidInput of invalidInputs) {
                const actual = validator.isValidForExecution(invalidInput);
                expect(actual).toBe(false);
            }
        });
    });
});
