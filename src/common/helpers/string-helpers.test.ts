import { capitalize, replaceWhitespace, stringIsWhiteSpace, unique } from "./string-helpers";

describe(capitalize.name, () => {
    //
});

describe(replaceWhitespace.name, () => {
    //
});

describe(stringIsWhiteSpace.name, () => {
    //
});

describe(unique.name, () => {
    it("should return empty array when passing in an empty array", () => {
        const actual = unique([]);
        expect(actual).not.toBe(undefined);
        expect(actual).not.toBe(null);
        expect(actual.length).toBe(0);
        expect(actual).toEqual([]);
    });

    it("should remove all duplicate entries", () => {
        const a = "a";
        const b = "b";
        const c = "c";

        const arrayWithDuplicates = [a, b, b, b, c, c, c, c, c, c];

        const expected = [a, b, c];
        const actual = unique(arrayWithDuplicates);

        expect(actual).toEqual(expected);
    });
});
