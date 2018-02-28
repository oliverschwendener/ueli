import { CommandLineInputValidator } from "../../../ts/input-validators/command-line-input-validator";

describe(CommandLineInputValidator.name, (): void => {
    const validator = new CommandLineInputValidator();

    describe(validator.isValidForSearchResults.name, (): void => {
        it("should return true when passing in a valid argument", (): void => {
            const validInputs = [
                ">ipconfig",
                ">ipconfig /flushdns",
                ">do some shit",
            ];

            for (const validInput of validInputs) {
                const actual = validator.isValidForSearchResults(validInput);
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
                const actual = validator.isValidForSearchResults(invalidInput);
                expect(actual).toBe(false);
            }
        });
    });
});
