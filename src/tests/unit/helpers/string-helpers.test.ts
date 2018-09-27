import { StringHelpers } from "../../../ts/helpers/string-helpers";
import { InputOutputCombination } from "../test-helpers";
import { validEmailAddresses, invalidEmailAddresses } from "./../test-helpers";

describe(StringHelpers.name, (): void => {
    describe(StringHelpers.removeWhiteSpace.name, (): void => {
        it("should replace all whitespace", (): void => {
            const combinations: InputOutputCombination[] = [
                {
                    input: " r e      m ove all w    h i t e sp ace",
                    output: "removeallwhitespace",
                },
            ];

            for (const combination of combinations) {
                const actual = StringHelpers.removeWhiteSpace(combination.input);
                expect(actual).toBe(combination.output);
            }
        });
    });

    describe(StringHelpers.stringIsWhiteSpace.name, (): void => {
        it("should return true if string is whitepace", (): void => {
            const whitspaceStrings = [
                "",
                " ",
                "     ",
                undefined,
            ];

            for (const whiteSpaceString of whitspaceStrings) {
                const actual = StringHelpers.stringIsWhiteSpace(whiteSpaceString as string);
                expect(actual).toBe(true);
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
                expect(actual).toBe(false);
            }
        });
    });

    describe(StringHelpers.trimAndReplaceMultipleWhiteSpacesWithOne.name, (): void => {
        it("should trim and replace all white spaces with one white space", (): void => {
            const combinations: InputOutputCombination[] = [
                {
                    input: "  this is      a    test string",
                    output: "this is a test string",
                },
                {
                    input: "this             is          a           test         string",
                    output: "this is a test string",
                },
                {
                    input: "this is a test                 string                   ",
                    output: "this is a test string",
                },
            ];

            for (const combination of combinations) {
                const actual = StringHelpers.trimAndReplaceMultipleWhiteSpacesWithOne(combination.input);
                expect(actual).toBe(combination.output);
            }
        });
    });

    describe(StringHelpers.stringToWords.name, (): void => {
        it("should convert a string to an array of its words", (): void => {
            const combinations: InputOutputCombination[] = [
                {
                    input: "this is a string",
                    output: ["this", "is", "a", "string"],
                },
                {
                    input: "  this    is    a             string      ",
                    output: ["this", "is", "a", "string"],
                },
                {
                    input: "this              is a string",
                    output: ["this", "is", "a", "string"],
                },
            ];

            for (const combination of combinations) {
                const acutal = StringHelpers.stringToWords(combination.input);

                for (let i = 0; i < acutal.length; i++) {
                    expect(acutal[i]).toBe(combination.output[i]);
                }
            }
        });
    });

    describe(StringHelpers.isValidEmailAddress.name, (): void => {
        it("should return true if email address is valid", (): void => {
            for (const validEmail of validEmailAddresses) {
                const actual = StringHelpers.isValidEmailAddress(validEmail);
                expect(actual).toBe(true);
            }
        });
    });

    describe(StringHelpers.isValidEmailAddress.name, (): void => {
        it("should return false if email address is invalid", (): void => {
            for (const invalidEmail of invalidEmailAddresses) {
                const actual = StringHelpers.isValidEmailAddress(invalidEmail as string);
                expect(actual).toBe(false);
            }
        });
    });
});
