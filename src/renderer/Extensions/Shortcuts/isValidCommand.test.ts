import { describe, expect, it } from "vitest";
import { isValidCommand } from "./isValidCommand";

describe(isValidCommand, () => {
    it("should return true for valid commands", () => {
        expect(isValidCommand("test")).toBe(true);
        expect(isValidCommand("t")).toBe(true);
    });

    it("should return false for invalid commands", () => {
        expect(isValidCommand("")).toBe(false);
        expect(isValidCommand(" ")).toBe(false);
        expect(isValidCommand("  ")).toBe(false);
    });
});
