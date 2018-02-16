import { expect } from "chai";
import { CommandLineExecutionArgumentValidator } from "../../../src/ts/execution-argument-validators/command-line-execution-argument-validator";

describe(CommandLineExecutionArgumentValidator.name, (): void => {
    let validator = new CommandLineExecutionArgumentValidator();

    describe(validator.isValidForExecution.name, (): void => {
        it("should return true when passing in a valid argument", (): void => {
            let validInputs = [
                ">ipconfig",
                ">ipconfig /flushdns",
                ">do some shit"
            ];

            for (let validInput of validInputs) {
                let actual = validator.isValidForExecution(validInput);
                expect(actual).to.be.true;
            }
        });

        it("should return false when passing in an invalid argument", (): void => {
            let invalidInputs = [
                ">",
                "ipconfig",
                "<ipconfig"
            ];

            for (let invalidInput of invalidInputs) {
                let actual = validator.isValidForExecution(invalidInput);
                expect(actual).to.be.false;
            }
        });
    });
});