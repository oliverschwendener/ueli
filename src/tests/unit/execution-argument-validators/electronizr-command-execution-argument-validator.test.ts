import { expect } from "chai";
import { ElectronizrCommandExecutionArgumentValidator } from "../../../ts/execution-argument-validators/electronizr-command-execution-argument-validator";

describe(ElectronizrCommandExecutionArgumentValidator.name, (): void => {
    const validator = new ElectronizrCommandExecutionArgumentValidator();

    describe(validator.isValidForExecution.name, (): void => {
        it("should return true when passing in a valid argument", (): void => {
            const validInputs = [
                "ezr:reload",
                "ezr:exit",
                "ezr:do-something",
            ];

            for (const validInput of validInputs) {
                const actual = validator.isValidForExecution(validInput);
                expect(actual).to.be.true;
            }
        });

        it("should return false when passing in an invalid argument", (): void => {
            const invalidInputs = [
                "ezr",
                "ezr:",
                "er:do-something",
                "bla bla",
            ];

            for (const invalidInput of invalidInputs) {
                const actual = validator.isValidForExecution(invalidInput);
                expect(actual).to.be.false;
            }
        });
    });
});
