import { describe, expect, it } from "vitest";
import { useOperatingSystem } from "./useOperatingSystem";

describe(useOperatingSystem, () => {
    it("should return 'Windows' when platform is 'win32'", () =>
        expect(useOperatingSystem({ platform: "win32" })).toBe("Windows"));

    it("should return 'macOS' when platform is 'darwin'", () =>
        expect(useOperatingSystem({ platform: "darwin" })).toBe("macOS"));

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
            expect(() => useOperatingSystem({ platform })).toThrow(`Unexpected platform: ${platform}`);
        }
    });
});
