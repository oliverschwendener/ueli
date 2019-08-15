import { isValidColorCode } from "./color-converter-helpers";

describe(isValidColorCode.name, () => {
    it("should return true if value is a valid hex code", () => {
        const validColorCodes = [
            "#fff",
            "#ffffff",
            "#FFF",
            "#FFFFFF",
            "rgb(255,255,255)",
            "rgba(255,255,255,0)",
            "rgb(1,2,3)",
            "rgba(0,0,0,1)",
            " #fff",
            "#fff   ",
        ];

        validColorCodes.forEach((validColorCode) => {
            const actual = isValidColorCode(validColorCode);
            expect(actual).toBe(true);
        });
    });

    it("should return false if value is an invalid hex code", () => {
        const invalidColorCodes = [
            "ffffff",
            "fff",
            "some string",
            "",
            "undefined",
            "null",
            "#",
            "rgb()",
            "rgba()",
            "blue",
            "black",
            "yellow",
        ];

        invalidColorCodes.forEach((invalidColorCode) => {
            const actual = isValidColorCode(invalidColorCode);
            expect(actual).toBe(false);
        });
    });
});
