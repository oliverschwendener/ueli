import { Config } from "../../../ts/config";
import { WebSearchExecutionArgumentValidator } from "../../../ts/execution-argument-validators/web-search-execution-argument-validator";
import { WebSearchHelpers } from "../../../ts/helpers/web-search-helper";

describe(WebSearchExecutionArgumentValidator.name, (): void => {
    const validator = new WebSearchExecutionArgumentValidator();

    describe(validator.isValidForExecution.name, (): void => {
        const webSearches = Config.webSearches;

        for (const webSearch of webSearches) {
            it("should return true when passing in a valid argument", (): void => {
                const validInputs = [
                    `${webSearch.prefix}${WebSearchHelpers.webSearchSeparator}search something`,
                    `${webSearch.prefix}${WebSearchHelpers.webSearchSeparator} search some thing`,
                    `${webSearch.prefix}${WebSearchHelpers.webSearchSeparator}s`,
                ];

                for (const validInput of validInputs) {
                    const actual = validator.isValidForExecution(validInput);
                    expect(actual).toBe(true);
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
                    expect(actual).toBe(false);
                }
            });
        }
    });
});
