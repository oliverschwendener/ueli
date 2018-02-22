import { expect } from "chai";
import { Config } from "../../../ts/config";
import { Injector } from "../../../ts/injector";
import { WebSearchInputValidator } from "../../../ts/input-validators/web-search-input-validator";

describe(WebSearchInputValidator.name, (): void => {
    const validator = new WebSearchInputValidator();
    const webSearches = Config.webSearches;

    for (const webSearch of webSearches) {
        it(`${webSearch.name} web search should return true when passing in a valid argument`, (): void => {
            const validInputs = [
                `${webSearch.prefix}${Config.webSearchSeparator}search something`,
                `${webSearch.prefix}${Config.webSearchSeparator} search some thing`,
                `${webSearch.prefix}${Config.webSearchSeparator}s`,
            ];

            for (const validInput of validInputs) {
                const actual = validator.isValidForSearchResults(validInput);
                expect(actual).to.be.true;
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
                expect(actual).to.be.false;
            }
        });
    }
});
