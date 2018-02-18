import { expect } from "chai";
import { WebSearchInputValidator } from "../../../src/ts/input-validators/web-search-input-validator";
import { Injector, OperatingSystem } from "../../../src/ts/injector";
import { Config } from "../../../src/ts/config";

describe(WebSearchInputValidator.name, (): void => {
    let validator = new WebSearchInputValidator();
    let webSearches = Config.webSearches;

    for (let webSearch of webSearches) {
        it(`${webSearch.name} web search should return true when passing in a valid argument`, (): void => {
            let validInputs = [
                `${webSearch.prefix}${Config.webSearchSeparator}search something`,
                `${webSearch.prefix}${Config.webSearchSeparator} search some thing`,
                `${webSearch.prefix}${Config.webSearchSeparator}s`,
            ];

            for (let validInput of validInputs) {
                let actual = validator.isValidForSearchResults(validInput);
                expect(actual).to.be.true;
            }
        });

        it(`${webSearch.name} web search should return false when passing in an invalid argument`, (): void => {
            let invalidInputs = [
                `${webSearch.prefix}`,
                "google something",
                "bla"
            ];

            for (let invalidInput of invalidInputs) {
                let actual = validator.isValidForSearchResults(invalidInput);
                expect(actual).to.be.false;
            }
        });
    }
});