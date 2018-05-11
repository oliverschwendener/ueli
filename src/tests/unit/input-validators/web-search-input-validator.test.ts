import { Config } from "../../../ts/config";
import { WebSearchHelpers } from "../../../ts/helpers/web-search-helper";
import { Injector } from "../../../ts/injector";
import { WebSearchInputValidator } from "../../../ts/input-validators/web-search-input-validator";

describe(WebSearchInputValidator.name, (): void => {
    const validator = new WebSearchInputValidator();
    const webSearches = Config.webSearches;

    for (const webSearch of webSearches) {
        it(`${webSearch.name} web search should return true when passing in a valid argument`, (): void => {
            const validInputs = [
                `${webSearch.prefix}${WebSearchHelpers.webSearchSeparator}search something`,
                `${webSearch.prefix}${WebSearchHelpers.webSearchSeparator} search some thing`,
                `${webSearch.prefix}${WebSearchHelpers.webSearchSeparator}s`,
            ];

            for (const validInput of validInputs) {
                const actual = validator.isValidForSearchResults(validInput);
                expect(actual).toBe(true);
            }
        });

        it(`${webSearch.name} web search should return false when passing in an invalid argument`, (): void => {
            const invalidInputs = [
                `${webSearch.prefix}`,
                "google something",
                "bla",
            ];

            for (const invalidInput of invalidInputs) {
                const actual = validator.isValidForSearchResults(invalidInput);
                expect(actual).toBe(false);
            }
        });
    }
});
