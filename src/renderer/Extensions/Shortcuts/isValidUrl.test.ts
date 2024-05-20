import { describe, expect, it } from "vitest";
import { isValidUrl } from "./isValidUrl";

describe(isValidUrl, () => {
    it("should return true for valid urls", () => {
        expect(isValidUrl("https://www.google.com")).toBe(true);
        expect(isValidUrl("http://www.google.com")).toBe(true);
        expect(isValidUrl("steam://rungameid/230410")).toBe(true);
    });

    it("should return false for invalid urls", () => {
        expect(isValidUrl("blub")).toBe(false);
        expect(isValidUrl("google.com")).toBe(false);
        expect(isValidUrl("https://")).toBe(false);
        expect(isValidUrl("http://")).toBe(false);
        expect(isValidUrl("ftp://")).toBe(false);
    });
});
