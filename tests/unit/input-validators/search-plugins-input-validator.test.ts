import { expect } from "chai";
import { SearchPluginsInputValidator } from "../../../src/ts/input-validators/search-plugins-input-validator";
import { Injector, OperatingSystem } from "../../../src/ts/injector";

describe(SearchPluginsInputValidator.name, (): void => {
    let validator = new SearchPluginsInputValidator();

    describe(validator.isValidForSearchResults.name, (): void => {
        it("should return true when passing in a valid argument", (): void => {
            let validInputs = [
                "search",
                "search something",
                "1234",
                " s earch sometghin"
            ];

            for (let validInput of validInputs) {
                let actual = validator.isValidForSearchResults(validInput);
                expect(actual).to.be.true;
            }
        });

        it("should return false when passing in an invalid argument", (): void => {
            let invalidInputs = [
                "",
                " ",
                "    ",
            ];

            for (let invalidInput of invalidInputs) {
                let actual = validator.isValidForSearchResults(invalidInput);
                expect(actual).to.be.false;
            }
        });
    });
});