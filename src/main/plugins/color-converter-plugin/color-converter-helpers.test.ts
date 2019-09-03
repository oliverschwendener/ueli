import { isValidColorCode, toHex } from "./color-converter-helpers";

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

describe(toHex.name, () => {
    it("should correctly convert a color to a hex value", () => {
        const colors = [
            {
                input: "#fff",
                output: "#FFFFFF",
            },
            {
                input: "#ffffff",
                output: "#FFFFFF",
            },
            {
                input: "rgb(255,255,255,1)",
                output: "#FFFFFF",
            },
            {
                input: "rgba(255,255,255,0.5)",
                output: "#FFFFFF",
            },
        ];

        colors.forEach((color) => {
            const actual = toHex(color.input, "");
            expect(actual).toBe(color.output);
        });
    });

    it("should return the specified default when failing to parse the color value", () => {
        const defaultColor = "#FF00DD";
        const colors = [
            "#f",
            "#",
            "rg(25,25,25,0)",
            "(255,255,255,1)",
            "hex(255,255,255,1)",
            "asdfasdf",
            "",
            "{whatever}",
            "1234",
        ];

        colors.forEach((color) => {
            const actual = toHex(color, defaultColor);
            expect(actual).toBe(defaultColor);
        });
    });
});
