import { expect } from "chai";
import { Config } from "../../../ts/config";
import { WebSearchExecutionArgumentValidator } from "../../../ts/execution-argument-validators/web-search-execution-argument-validator";

describe(WebSearchExecutionArgumentValidator.name, (): void => {
    const validator = new WebSearchExecutionArgumentValidator();

    describe(validator.isValidForExecution.name, (): void => {
        const webSearches = Config.webSearches;

        for (const webSearch of webSearches) {
            it("should return true when passing in a valid argument", (): void => {
                const validInputs = [
                    `${webSearch.prefix}${Config.webSearchSeparator}search something`,
                    `${webSearch.prefix}${Config.webSearchSeparator} search some thing`,
                    `${webSearch.prefix}${Config.webSearchSeparator}s`,
                ];

                for (const validInput of validInputs) {
                    const actual = validator.isValidForExecution(validInput);
                    expect(actual).to.be.true;
                }
            });

            it("should return false when passing in an invalid argument", (): void => {
                const invalidInputs = [
                    `${webSearch.prefix}`,
                    "google something",
                    "bla",
                ];

                for (const invalidInput of invalidInputs) {
                    const actual = validator.isValidForExecution(invalidInput);
                    expect(actual).to.be.false;
                }
            });
        }
    });
});
