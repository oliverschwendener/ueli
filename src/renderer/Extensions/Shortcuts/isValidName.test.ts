import { describe, expect, it } from "vitest";
import { isValidName } from "./isValidName";

describe(isValidName, () => {
    it("should return true for valid names", () => {
        expect(isValidName("test")).toBe(true);
        expect(isValidName("t")).toBe(true);
    });

    it("should return false for invalid names", () => {
        expect(isValidName("")).toBe(false);
        expect(isValidName(" ")).toBe(false);
        expect(isValidName("  ")).toBe(false);
    });
});
