import { expect } from "chai";
import { StringHelpers } from "../../../src/ts/helpers/string-helpers";

describe(StringHelpers.name, (): void => {
    describe(StringHelpers.removeWhiteSpace.name, (): void => {
        it("should replace all whitespace", (): void => {
            let combinations = [
                <InputOutputCombination>{
                    input: " r e      m ove all w    h i t e sp ace",
                    output: "removeallwhitespace"
                }
            ];

            for (let combination of combinations) {
                let actual = StringHelpers.removeWhiteSpace(combination.input);
                expect(actual).to.eql(combination.output);
            }
        });
    });

    describe(StringHelpers.stringIsWhiteSpace.name, (): void => {
        it("should return true if string is whitepace", (): void => {
            let whitspaceStrings = [
                "",
                " ",
                "     "
            ];

            for (let whiteSpaceString of whitspaceStrings) {
                let actual = StringHelpers.stringIsWhiteSpace(whiteSpaceString);
                expect(actual).to.be.true;
            }
        });

        it("should return false if string is not whitespace", (): void => {
            let notWhiteSpaceStrings = [
                ".",
                "   a",
                "this is a string",
                "a       "
            ];

            for (let notWhiteSpaceString of notWhiteSpaceStrings) {
                let actual = StringHelpers.stringIsWhiteSpace(notWhiteSpaceString);
                expect(actual).to.be.false;
            }
        });
    });

    describe(StringHelpers.trimAndReplaceMultipleWhiteSpacesWithOne.name, (): void => {
        it("should trim and replace all white spaces with one white space", (): void => {
            let combinations = [
                <InputOutputCombination>{
                    input: "  this is      a    test string",
                    output: "this is a test string"
                },
                <InputOutputCombination>{
                    input: "this             is          a           test         string",
                    output: "this is a test string"
                },
                <InputOutputCombination>{
                    input: "this is a test                 string                   ",
                    output: "this is a test string"
                }
            ];

            for (let combination of combinations) {
                let actual = StringHelpers.trimAndReplaceMultipleWhiteSpacesWithOne(combination.input);
                expect(actual).to.equal(combination.output);
            }
        });
    });
});

class InputOutputCombination {
    public input: any;
    public output: any;
}