import { CustomCommandExecutionArgumentValidator } from "../../../ts/execution-argument-validators/custom-command-exeuction-argument-validator";
import { UeliHelpers } from "../../../ts/helpers/ueli-helpers";

describe(CustomCommandExecutionArgumentValidator.name, (): void => {
    const validator = new CustomCommandExecutionArgumentValidator();

    describe(validator.isValidForExecution.name, (): void => {
        it("should return true when passing in a valid execution argument", (): void => {
            const validInputs = [
                `${UeliHelpers.customCommandPrefix}do something`,
                `${UeliHelpers.customCommandPrefix}start \"\" \"C:\\my-folder\"`,
            ];

            for (const validInput of validInputs) {
                const acutal = validator.isValidForExecution(validInput);
                expect(acutal).toBe(true);
            }
        });

        it("should return false when passing in an invalid execution argument", (): void => {
            const invalidInputs = [
                "",
                UeliHelpers.customCommandPrefix,
                "something",
                "https://google.com",
                "132498",
            ];

            for (const invalidInput of invalidInputs) {
                const acutal = validator.isValidForExecution(invalidInput);
                expect(acutal).toBe(false);
            }
        });
    });
});
