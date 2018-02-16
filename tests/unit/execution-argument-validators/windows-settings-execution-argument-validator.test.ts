import { expect } from "chai";
import { WindowsSettingsExecutionArgumentValidator } from "../../../src/ts/execution-argument-validators/windows-settings-execution-argument-validator";

describe(WindowsSettingsExecutionArgumentValidator.name, (): void => {
    let validator = new WindowsSettingsExecutionArgumentValidator();

    describe(validator.isValidForExecution.name, (): void => {
        it("should return true when passing in a valid argument", (): void => {
            let validInputs = [
                "win:ms-settings:",
                "win:winver",
                "win:shutdown",
                "win:shutdown -s -t 0"
            ];

            for (let validInput of validInputs) {
                let actual = validator.isValidForExecution(validInput);
                expect(actual).to.be.true;
            }
        });

        it("should return false when passing in an invalid argument", (): void => {
            let invalidInputs = [
                "",
                "win",
                "win:",
                "1234öm",
                "some bullshit"
            ];

            for (let invalidInput of invalidInputs) {
                let actual = validator.isValidForExecution(invalidInput);
                expect(actual).to.be.false;
            }
        });
    });
});