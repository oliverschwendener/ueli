import { expect } from "chai";
import { StringHelpers } from "../../../ts/helpers/string-helpers";
import { InputOutputCombination } from "../test-helpers";

describe(StringHelpers.name, (): void => {
    describe(StringHelpers.removeWhiteSpace.name, (): void => {
        it("should replace all whitespace", (): void => {
            const combinations = [
                {
                    input: " r e      m ove all w    h i t e sp ace",
                    output: "removeallwhitespace",
                } as InputOutputCombination,
            ];

            for (const combination of combinations) {
                const actual = StringHelpers.removeWhiteSpace(combination.input);
                expect(actual).to.eql(combination.output);
            }
        });
    });

    describe(StringHelpers.stringIsWhiteSpace.name, (): void => {
        it("should return true if string is whitepace", (): void => {
            const whitspaceStrings = [
                "",
                " ",
                "     ",
            ];

            for (const whiteSpaceString of whitspaceStrings) {
                const actual = StringHelpers.stringIsWhiteSpace(whiteSpaceString);
                expect(actual).to.be.true;
            }
        });

        it("should return false if string is not whitespace", (): void => {
            const notWhiteSpaceStrings = [
                ".",
                "   a",
                "this is a string",
                "a       ",
            ];

            for (const notWhiteSpaceString of notWhiteSpaceStrings) {
                const actual = StringHelpers.stringIsWhiteSpace(notWhiteSpaceString);
                expect(actual).to.be.false;
            }
        });
    });

    describe(StringHelpers.trimAndReplaceMultipleWhiteSpacesWithOne.name, (): void => {
        it("should trim and replace all white spaces with one white space", (): void => {
            const combinations = [
                {
                    input: "  this is      a    test string",
                    output: "this is a test string",
                } as InputOutputCombination,
                {
                    input: "this             is          a           test         string",
                    output: "this is a test string",
                } as InputOutputCombination,
                {
                    input: "this is a test                 string                   ",
                    output: "this is a test string",
                } as InputOutputCombination,
            ];

            for (const combination of combinations) {
                const actual = StringHelpers.trimAndReplaceMultipleWhiteSpacesWithOne(combination.input);
                expect(actual).to.equal(combination.output);
            }
        });
    });

    describe(StringHelpers.stringToWords.name, (): void => {
        it("should convert a string to an array of its words", (): void => {
            const combinations = [
                {
                    input: "this is a string",
                    output: ["this", "is", "a", "string"],
                } as InputOutputCombination,
                {
                    input: "  this    is    a             string      ",
                    output: ["this", "is", "a", "string"],
                } as InputOutputCombination,
                {
                    input: "this              is a string",
                    output: ["this", "is", "a", "string"],
                } as InputOutputCombination,
            ];

            for (const combination of combinations) {
                const acutal = StringHelpers.stringToWords(combination.input);

                for (let i = 0; i < acutal.length; i++) {
                    expect(acutal[i]).to.equal(combination.output[i]);
                }
            }
        });
    });
});
