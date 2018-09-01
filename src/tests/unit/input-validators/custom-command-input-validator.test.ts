import { CustomCommandInputValidator } from "../../../ts/input-validators/custom-command-input-validator";
import { CustomCommand } from "../../../ts/custom-shortcut";

describe(CustomCommandInputValidator.name, (): void => {
    const customCommands = [
        {
            prefix: "openwithcode",
        },
        {
            prefix: "openwithcmd",
        },
    ] as CustomCommand[];

    const validator = new CustomCommandInputValidator(customCommands);

    describe(validator.isValidForSearchResults.name, (): void => {
        it("should return true if user input matches a custom command", (): void => {
            const validInputs = [
                "openwithcode C:\\projects\\ueli",
                "openwithcode second-argument",
            ];

            for (const validInput of validInputs) {
                const actual = validator.isValidForSearchResults(validInput);
                expect(actual).toBe(true);
            }
        });

        it("should return false if user input does no match any custom command", (): void => {
            const invalidInputs = [
                "openwithcode",
                "openwithcod",
                "open",
                "asdf",
                "",
                "      ",
            ];

            for (const invalidInput of invalidInputs) {
                const actual = validator.isValidForSearchResults(invalidInput);
                expect(actual).toBe(false);
            }
        });
    });
});
