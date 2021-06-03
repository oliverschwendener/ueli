import { deepCopy, isEqual } from "./object-helpers";

describe(deepCopy.name, () => {
    function getOriginal() {
        return {
            children: [{ name: "Sue" }, { name: "Martin" }],
            name: "Joe Doe",
        };
    }

    it("should properly copy an object", () => {
        const original = getOriginal();
        const copy = deepCopy(original);
        expect(JSON.stringify(copy)).toBe(JSON.stringify(getOriginal()));
    });

    it("copy should not be affected when mutating original", () => {
        const original = getOriginal();
        const copy = deepCopy(original);

        copy.name = "Peter";
        copy.children = [{ name: "a" }, { name: "b" }, { name: "c" }, { name: "d" }];

        expect(original.name).toBe(getOriginal().name);
        expect(original.children.length).toBe(getOriginal().children.length);
    });
});

describe(isEqual.name, () => {
    it("should return true if values are equal", () => {
        const pairs = [
            {
                a: 1,
                b: 1,
            },
            {
                a: "hello",
                b: "hello",
            },
            {
                a: undefined,
                b: undefined,
            },
            {
                a: null,
                b: null,
            },
            {
                a: {},
                b: {},
            },
            {
                a: [],
                b: [],
            },
            {
                a: [1, 2, 3, "4", "hello", undefined, { value: "shit", value2: 2 }, true, false],
                b: [1, 2, 3, "4", "hello", undefined, { value: "shit", value2: 2 }, true, false],
            },
        ];

        pairs.forEach((pair) => expect(isEqual(pair.a, pair.b)).toBe(true));
    });

    it("should return false if values are not equal", () => {
        const pairs = [
            {
                a: 1,
                b: 2,
            },
            {
                a: "hello",
                b: "hello ",
            },
            {
                a: undefined,
                b: null,
            },
            {
                a: { value: "abc" },
                b: { value: "abcd" },
            },
        ];

        pairs.forEach((pair) => expect(isEqual(pair.a, pair.b)).toBe(false));
    });
});
