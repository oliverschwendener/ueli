import { expect } from "chai";
import { ElectronizrCommandExecutionArgumentValidator } from "../../../src/ts/execution-argument-validators/electronizr-command-execution-argument-validator";

describe(ElectronizrCommandExecutionArgumentValidator.name, (): void => {
    let validator = new ElectronizrCommandExecutionArgumentValidator();

    describe(validator.isValidForExecution.name, (): void => {
        it("should return true when passing in a valid argument", (): void => {
            let validInputs = [
                "ezr:reload",
                "ezr:exit",
                "ezr:do-something"
            ];

            for (let validInput of validInputs) {
                let actual = validator.isValidForExecution(validInput);
                expect(actual).to.be.true;
            }
        });

        it("should return false when passing in an invalid argument", (): void => {
            let invalidInputs = [
                "ezr",
                "ezr:",
                "er:do-something",
                "bla bla"
            ];

            for (let invalidInput of invalidInputs) {
                let actual = validator.isValidForExecution(invalidInput);
                expect(actual).to.be.false;
            }
        });
    });
});