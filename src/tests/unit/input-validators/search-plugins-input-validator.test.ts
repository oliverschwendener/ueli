import { Injector } from "../../../ts/injector";
import { SearchPluginsInputValidator } from "../../../ts/input-validators/search-plugins-input-validator";

describe(SearchPluginsInputValidator.name, (): void => {
    const validator = new SearchPluginsInputValidator();

    describe(validator.isValidForSearchResults.name, (): void => {
        it("should return true when passing in a valid argument", (): void => {
            const validInputs = [
                "search",
                "search something",
                "1234",
                " s earch sometghin",
            ];

            for (const validInput of validInputs) {
                const actual = validator.isValidForSearchResults(validInput);
                expect(actual).toBe(true);
            }
        });

        it("should return false when passing in an invalid argument", (): void => {
            const invalidInputs = [
                "",
                " ",
                "    ",
            ];

            for (const invalidInput of invalidInputs) {
                const actual = validator.isValidForSearchResults(invalidInput);
                expect(actual).toBe(false);
            }
        });
    });
});
