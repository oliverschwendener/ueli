import { formatNumberSeparator } from "./number-formatter-helpers";
import {InputOutputCombination} from "../../tests/test-helper";


describe(formatNumberSeparator.name, () => {

    it("should correctly display with the separator", () => {
        const inputOutputCombinations: InputOutputCombination[] = [
            {
                input: "9477",
                output: "9,477",
            },
            {
                input: "true",
                output: "true",
            },
            {
                input: "0.4745454545",
                output: "0.4745454545",
            },
            {
                input: "2232322.442",
                output: "2,232,322.442",
            },
            {
                input: "[[8, 11, 14], [13, 15, 17]]",
                output: "[[8, 11, 14], [13, 15, 17]]",
            },
        ];

        inputOutputCombinations.forEach((combination) => {
            const actual = formatNumberSeparator(combination.input, ",");
            const expected = combination.output;
            expect(actual).toBe(expected);
        });
    });


});
