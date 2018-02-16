import { expect } from "chai";
import { WebUrlExecutionArgumentValidator } from "../../../src/ts/execution-argument-validators/web-url-execution-argument-validator";

describe(WebUrlExecutionArgumentValidator.name, (): void => {
    let validator = new WebUrlExecutionArgumentValidator();

    describe(validator.isValidForExecution.name, (): void => {
        it("should return true when passing in a valid argument", (): void => {
            let validInputs = [
                "google.com",
                "http://google.com",
                "https://google.com",
                "google.com/search/?query=google-something&param=value",
                "https://www.google.com/search/?query=google-something&param=value",
                "www.google.com/search/?query=google-something&param=value"
            ];

            for (let validInput of validInputs) {
                let actual = validator.isValidForExecution(validInput);
                expect(actual).to.be.true;
            }
        });

        it("should return false when passing in an invalid argument", (): void => {
            let invalidInputs = [
                "",
                "google . com",
                "http://",
                "some-bullshit",
                "12340.12"
            ];

            for (let invalidInput of invalidInputs) {
                let actual = validator.isValidForExecution(invalidInput);
                expect(actual).to.be.false;
            }
        });
    });
});