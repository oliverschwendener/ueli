import { Injector } from "../../../ts/injector";
import { WebUrlInputValidator } from "../../../ts/input-validators/web-url-input-validator";
import { validUrls, invalidUrls } from "../test-helpers";

describe(WebUrlInputValidator.name, (): void => {
    const validator = new WebUrlInputValidator();

    describe(validator.isValidForSearchResults.name, (): void => {
        it("should return true when passing in a valid argument", (): void => {
            for (const validInput of validUrls) {
                const actual = validator.isValidForSearchResults(validInput);
                expect(actual).toBe(true);
            }
        });

        it("should return false when passing in an invalid argument", (): void => {
            for (const invalidInput of invalidUrls) {
                const actual = validator.isValidForSearchResults(invalidInput);
                expect(actual).toBe(false);
            }
        });
    });
});
