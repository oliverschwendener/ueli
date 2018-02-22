import { expect } from "chai";
import { Injector } from "../../../ts/injector";
import { WebUrlInputValidator } from "../../../ts/input-validators/web-url-input-validator";

describe(WebUrlInputValidator.name, (): void => {
    const validator = new WebUrlInputValidator();

    describe(validator.isValidForSearchResults.name, (): void => {
        it("should return true when passing in a valid argument", (): void => {
            const validInputs = [
                "google.com",
                "http://google.com",
                "https://google.com",
                "google.com/search/?query=google-something&param=value",
                "https://www.google.com/search/?query=google-something&param=value",
                "www.google.com/search/?query=google-something&param=value",
            ];

            for (const validInput of validInputs) {
                const actual = validator.isValidForSearchResults(validInput);
                expect(actual).to.be.true;
            }
        });

        it("should return false when passing in an invalid argument", (): void => {
            const invalidInputs = [
                "",
                "google . com",
                "http://",
                "some-bullshit",
                "12340.12",
            ];

            for (const invalidInput of invalidInputs) {
                const actual = validator.isValidForSearchResults(invalidInput);
                expect(actual).to.be.false;
            }
        });
    });
});
