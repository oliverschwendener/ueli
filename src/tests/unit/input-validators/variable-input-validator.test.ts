import { VariableInputValidator } from "../../../ts/input-validators/variable-input-validator";

describe(VariableInputValidator.name, (): void => {
    const validator = new VariableInputValidator();
    describe(validator.isValidForSearchResults.name, (): void => {
        it("Should return true if user input has $ as prefix", (): void => {
            expect(validator.isValidForSearchResults("$ayyyy")).toBe(true);
        });
        it("Should return false if user input doesn't have $ as prefix", (): void => {
            expect(validator.isValidForSearchResults(">yoooo")).toBe(false);
            expect(validator.isValidForSearchResults("!aklsdjflks")).toBe(false);
            expect(validator.isValidForSearchResults("asdasdsad")).toBe(false);
        });
    });
});
