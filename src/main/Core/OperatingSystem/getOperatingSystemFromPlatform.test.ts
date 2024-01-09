import type { OperatingSystem } from "@common/OperatingSystem";
import { describe, expect, it } from "vitest";
import { getOperatingSystemFromPlatform } from "./getOperatingSystemFromPlatform";

describe(getOperatingSystemFromPlatform, () => {
    const testGetOperatingSystemFromPlatform = ({
        platform,
        expected,
    }: {
        expected: OperatingSystem;
        platform: string;
    }) => expect(getOperatingSystemFromPlatform(platform)).toBe(expected);

    it("should return Windows when platform is win32", () =>
        testGetOperatingSystemFromPlatform({ expected: "Windows", platform: "win32" }));

    it("should return macOS when platform is darwin", () =>
        testGetOperatingSystemFromPlatform({ expected: "macOS", platform: "darwin" }));

    it("should return Linux when platform is linux", () =>
        testGetOperatingSystemFromPlatform({ expected: "Linux", platform: "linux" }));

    it("should throw an error when platform is not win32 or darwin", () =>
        expect(() => getOperatingSystemFromPlatform("windows")).toThrowError("Unexpected platform: windows"));
});
