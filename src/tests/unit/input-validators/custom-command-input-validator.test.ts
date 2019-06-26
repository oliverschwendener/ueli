import { CustomCommandInputValidator } from "../../../ts/input-validators/custom-command-input-validator";
import { CustomCommand } from "../../../ts/custom-command";

describe(CustomCommandInputValidator.name, (): void => {
    const customCommands = [
        { prefix: "openwithcode" },
        { prefix: "openwithcmd" },
    ] as CustomCommand[];

    const validInputs = [
        "openwithcode C:\\projects\\ueli",
        "openwithcode second-argument",
        "open C:\\projects\\ueli",
        "o C:\\projects\\ueli",
    ];

    const invalidInputs = [
        "openwithcode",
        "openwithcmd",
        "opn",
        "asdf",
        "",
        "      ",
    ];

    describe("isValidForSearchResults", (): void => {
        it("should return true if user input matches a custom command", (): void => {
            const validator = new CustomCommandInputValidator(customCommands);
            validInputs.forEach((validInput) => {
                const actual = validator.isValidForSearchResults(validInput);
                expect(actual).toBe(true);
            });
        });

        it("should return false if user input does no match any custom command", (): void => {
            const validator = new CustomCommandInputValidator(customCommands);
            invalidInputs.forEach((invalidInput) => {
                const actual = validator.isValidForSearchResults(invalidInput);
                expect(actual).toBe(false);
            });
        });

        it("should return false if custom command prefix is empty", (): void => {
            const customCommand = { prefix: undefined } as CustomCommand;
            const validator = new CustomCommandInputValidator([customCommand]);
            validInputs.forEach((validInput) => {
                const acutal = validator.isValidForSearchResults(validInput);
                expect(acutal).toBe(false);
            });
        });
    });
});
