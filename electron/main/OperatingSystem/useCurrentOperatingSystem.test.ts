import { describe, expect, it } from "vitest";
import { useCurrentOperatingSystem } from "./useCurrentOperatingSystem";

describe(useCurrentOperatingSystem, () => {
    it("should return 'Windows' when platform is 'win32'", () =>
        expect(useCurrentOperatingSystem({ platform: "win32" })).toBe("Windows"));

    it("should return 'macOS' when platform is 'darwin'", () =>
        expect(useCurrentOperatingSystem({ platform: "darwin" })).toBe("macOS"));

    it("should throw an error when platform is not 'win32' or 'darwin'", () => {
        const platforms: string[] = [
            "   ",
            "",
            "Darwin",
            "debian",
            "linux",
            "mac",
            "macos",
            "ubuntu",
            "WIN",
            "WIN32",
            "window",
            "Windows",
        ];

        for (const platform of platforms) {
            expect(() => useCurrentOperatingSystem({ platform })).toThrow(`Unexpected platform: ${platform}`);
        }
    });
});
