import { expect } from "chai";
import { WindowsSettingsExecutionArgumentValidator } from "../../../ts/execution-argument-validators/windows-settings-execution-argument-validator";

describe(WindowsSettingsExecutionArgumentValidator.name, (): void => {
    const validator = new WindowsSettingsExecutionArgumentValidator();

    describe(validator.isValidForExecution.name, (): void => {
        it("should return true when passing in a valid argument", (): void => {
            const validInputs = [
                "win:ms-settings:",
                "win:winver",
                "win:shutdown",
                "win:shutdown -s -t 0",
            ];

            for (const validInput of validInputs) {
                const actual = validator.isValidForExecution(validInput);
                expect(actual).to.be.true;
            }
        });

        it("should return false when passing in an invalid argument", (): void => {
            const invalidInputs = [
                "",
                "win",
                "win:",
                "1234öm",
                "some bullshit",
            ];

            for (const invalidInput of invalidInputs) {
                const actual = validator.isValidForExecution(invalidInput);
                expect(actual).to.be.false;
            }
        });
    });
});
