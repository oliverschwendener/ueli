import { expect } from "chai";
import { CommandLineInputValidator } from "../../../src/ts/input-validators/command-line-input-validator";

describe(CommandLineInputValidator.name, (): void => {
    let validator = new CommandLineInputValidator();

    describe(validator.isValidForSearchResults.name, (): void => {
        it("should return true when passing in a valid argument", (): void => {
            let validInputs = [
                ">ipconfig",
                ">ipconfig /flushdns",
                ">do some shit"
            ];

            for (let validInput of validInputs) {
                let actual = validator.isValidForSearchResults(validInput);
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
                let actual = validator.isValidForSearchResults(invalidInput);
                expect(actual).to.be.false;
            }
        });
    });
});