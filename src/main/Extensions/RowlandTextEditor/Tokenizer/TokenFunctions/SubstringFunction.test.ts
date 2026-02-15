import { describe, expect, it } from "vitest";
import { SubstringFunction } from "./SubstringFunction";

describe(SubstringFunction, () => {
    describe(SubstringFunction.prototype.evaluate, () => {
        it("should return the correct substring", () => {
            expect(new SubstringFunction().evaluate(["Hello, World!", "0", "5"])).toEqual("Hello");
            expect(new SubstringFunction().evaluate(["Hello, World!", "7", "12"])).toEqual("World");
        });

        it("should throw an error if there are less than 3 parameters", () => {
            expect(() => new SubstringFunction().evaluate(["Hello, World!", "0"])).toThrow(
                "SUBSTRING function requires at least 3 parameters: string, start, length",
            );
        });

        it("should throw an error if start or length parameters are not valid numbers", () => {
            expect(() => new SubstringFunction().evaluate(["Hello, World!", "start", "5"])).toThrow(
                "Start and length parameters must be valid numbers",
            );
            expect(() => new SubstringFunction().evaluate(["Hello, World!", "0", "length"])).toThrow(
                "Start and length parameters must be valid numbers",
            );
        });
    });
});
