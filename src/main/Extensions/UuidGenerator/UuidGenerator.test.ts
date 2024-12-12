import { version as uuidVersion } from "uuid";
import { describe, expect, it } from "vitest";
import { UuidGenerator } from "./UuidGenerator";

describe(UuidGenerator, () => {
    const defaultUuidRegexPattern = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/;

    describe(UuidGenerator.generatev4, () => {
        it("should return a correct v4 uuid", () => {
            const uuid = UuidGenerator.generatev4();
            expect(uuid).toMatch(defaultUuidRegexPattern);
            expect(uuidVersion(uuid)).toBe(4);
        });
    });

    describe(UuidGenerator.generatev6, () => {
        it("should return a correct v6 uuid", () => {
            const uuid = UuidGenerator.generatev6();
            expect(uuid).toMatch(defaultUuidRegexPattern);
            expect(uuidVersion(uuid)).toBe(6);
        });
    });

    describe(UuidGenerator.generatev6, () => {
        it("should return a correct v7 uuid", () => {
            const uuid = UuidGenerator.generatev7();
            expect(uuid).toMatch(defaultUuidRegexPattern);
            expect(uuidVersion(uuid)).toBe(7);
        });
    });

    describe(UuidGenerator.format, () => {
        it("should throw an error if the uuid is invalid", () => {
            expect(() => UuidGenerator.format("invalid-uuid", false, false, false, false)).toThrow("Invalid UUID");
        });

        it.each([
            ["21771a07-7dce-40b3-850e-386c1a0f5a2d", false, false, false, false, /[0-9a-f]{32}/],
            ["21771a07-7dce-40b3-850e-386c1a0f5a2d", true, false, false, false, /[0-9A-F]{32}/],
            ["21771a07-7dce-40b3-850e-386c1a0f5a2d", false, true, false, false, defaultUuidRegexPattern],
            ["21771a07-7dce-40b3-850e-386c1a0f5a2d", false, false, true, false, /\{[0-9a-f]{32}\}/],
            ["21771a07-7dce-40b3-850e-386c1a0f5a2d", false, false, false, true, /"[0-9a-f]{32}"/],
            ["21771a07-7dce-40b3-850e-386c1a0f5a2d", false, false, true, true, /"\{[0-9a-f]{32}\}"/],
        ])("should format uuid correctly", (uuid, uppercase, hyphens, braces, quotes, expectedPattern) => {
            const formattedUuid = UuidGenerator.format(uuid, uppercase, hyphens, braces, quotes);
            expect(formattedUuid).toMatch(expectedPattern);
        });
    });
});
