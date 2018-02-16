import { expect } from "chai";
import { WebSearchExecutionArgumentValidator } from "../../../src/ts/execution-argument-validators/web-search-execution-argument-validator";
import { Config } from "../../../src/ts/config";

describe(WebSearchExecutionArgumentValidator.name, (): void => {
    let validator = new WebSearchExecutionArgumentValidator();

    describe(validator.isValidForExecution.name, (): void => {
        let webSearches = Config.webSearches;

        for (let webSearch of webSearches) {
            it("should return true when passing in a valid argument", (): void => {
                let validInputs = [
                    `${webSearch.prefix}${Config.webSearchSeparator}search something`,
                    `${webSearch.prefix}${Config.webSearchSeparator} search some thing`,
                    `${webSearch.prefix}${Config.webSearchSeparator}s`,
                ];

                for (let validInput of validInputs) {
                    let actual = validator.isValidForExecution(validInput);
                    expect(actual).to.be.true;
                }
            });

            it("should return false when passing in an invalid argument", (): void => {
                let invalidInputs = [
                    `${webSearch.prefix}`,
                    "google something",
                    "bla"
                ];

                for (let invalidInput of invalidInputs) {
                    let actual = validator.isValidForExecution(invalidInput);
                    expect(actual).to.be.false;
                }
            });
        }
    });
});