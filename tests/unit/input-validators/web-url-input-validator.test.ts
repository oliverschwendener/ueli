import { expect } from "chai";
import { WebUrlInputValidator } from "../../../src/ts/input-validators/web-url-input-validator";
import { Injector, OperatingSystem } from "../../../src/ts/injector";

describe(WebUrlInputValidator.name, (): void => {
    let validator = new WebUrlInputValidator();

    describe(validator.isValidForSearchResults.name, (): void => {
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
                let actual = validator.isValidForSearchResults(validInput);
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
                let actual = validator.isValidForSearchResults(invalidInput);
                expect(actual).to.be.false;
            }
        });
    });
});