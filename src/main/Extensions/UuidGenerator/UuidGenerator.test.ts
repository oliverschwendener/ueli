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
            expect(() =>
                UuidGenerator.format(
                    "invalid-uuid",
                    {
                        uppercase: false,
                        hyphens: false,
                        braces: false,
                        quotes: false,
                    },
                    true,
                ),
            ).toThrow("Invalid UUID");
        });

        it.each([
            ["21771a07-7dce-40b3-850e-386c1a0f5a2d", false, false, false, false, /[0-9a-f]{32}/],
            ["21771a07-7dce-40b3-850e-386c1a0f5a2d", true, false, false, false, /[0-9A-F]{32}/],
            ["21771a07-7dce-40b3-850e-386c1a0f5a2d", false, true, false, false, defaultUuidRegexPattern],
            ["21771a07-7dce-40b3-850e-386c1a0f5a2d", false, false, true, false, /\{[0-9a-f]{32}\}/],
            ["21771a07-7dce-40b3-850e-386c1a0f5a2d", false, false, false, true, /"[0-9a-f]{32}"/],
            ["21771a07-7dce-40b3-850e-386c1a0f5a2d", false, false, true, true, /"\{[0-9a-f]{32}\}"/],
        ])("should format uuid correctly", (uuid, uppercase, hyphens, braces, quotes, expectedPattern) => {
            const formattedUuid = UuidGenerator.format(
                uuid,
                {
                    uppercase: uppercase,
                    hyphens: hyphens,
                    braces: braces,
                    quotes: quotes,
                },
                true,
            );
            expect(formattedUuid).toMatch(expectedPattern);
        });
    });

    describe(UuidGenerator.validateUuidStrictly, () => {
        it.each([
            ["21771a07-7dce-40b3-850e-386c1a0f5a2d", true],
            ["21771a07-7dce-40b3-850e-386c1a0f5a2z", false],
            ["99edf227-d64c-5d90-d314-5d998c38c687", false],
            ["e4cecde9-9c8e-c386-d314-b0c2d00161ea", false],
            ["c7dc2472-4d58-7f9d-d314-9568005e9720", false],
            ["db6b61a3-b22c-0999-d314-c0a53428d3e1", false],
            ["e9d98550-d8e9-7ab4-d314-a8a540011a47", false],
        ])("should validate uuid correctly (strict mode)", (uuid, expectedIsValid) => {
            const isValid = UuidGenerator.validateUuidStrictly(uuid).toString();
            expect(isValid).toMatch(expectedIsValid.toString());
        });
    });

    describe(UuidGenerator.validateUuid, () => {
        it.each([
            ["21771a07-7dce-40b3-850e-386c1a0f5a2d", true],
            ["21771a07-7dce-40b3-850e-386c1a0f5a2z", false],
            ["99edf227-d64c-5d90-d314-5d998c38c687", true],
            ["e4cecde9-9c8e-c386-d314-b0c2d00161ea", true],
            ["c7dc2472-4d58-7f9d-d314-9568005e9720", true],
            ["db6b61a3-b22c-0999-d314-c0a53428d3e1", true],
            ["e9d98550-d8e9-7ab4-d314-a8a540011a47", true],
        ])("should validate uuid correctly (not in strict mode)", (uuid, expectedIsValid) => {
            const isValid = UuidGenerator.validateUuid(uuid).toString();
            expect(isValid).toMatch(expectedIsValid.toString());
        });
    });

    describe(UuidGenerator.reformat, () => {
        it.each([
            ["21771a07-7dce-40b3-850e-386c1a0f5a2d", false, false, false, false, /21771a077dce40b3850e386c1a0f5a2d/],
            ["21771a07-7dce-40b3-850e-386c1a0f5a2d", true, false, false, false, /21771A077DCE40B3850E386C1A0F5A2D/],
            ["21771a07-7dce-40b3-850e-386c1a0f5a2d", false, true, false, false, /21771a07-7dce-40b3-850e-386c1a0f5a2d/],
            ["21771a07-7dce-40b3-850e-386c1a0f5a2d", false, false, true, false, /{21771a077dce40b3850e386c1a0f5a2d}/],
            ["21771a07-7dce-40b3-850e-386c1a0f5a2d", false, false, false, true, /"21771a077dce40b3850e386c1a0f5a2d"/],
            ["21771a07-7dce-40b3-850e-386c1a0f5a2d", true, true, false, false, /21771A07-7DCE-40B3-850E-386C1A0F5A2D/],
            [
                "21771a07-7dce-40b3-850e-386c1a0f5a2d",
                false,
                true,
                true,
                false,
                /{21771a07-7dce-40b3-850e-386c1a0f5a2d}/,
            ],
            ["21771a07-7dce-40b3-850e-386c1a0f5a2d", false, false, true, true, /"{21771a077dce40b3850e386c1a0f5a2d}"/],
            ["21771a07-7dce-40b3-850e-386c1a0f5a2d", true, false, false, true, /"21771A077DCE40B3850E386C1A0F5A2D"/],
            ["21771a07-7dce-40b3-850e-386c1a0f5a2d", true, true, true, false, /{21771A07-7DCE-40B3-850E-386C1A0F5A2D}/],
            [
                "21771a07-7dce-40b3-850e-386c1a0f5a2d",
                false,
                true,
                true,
                true,
                /"{21771a07-7dce-40b3-850e-386c1a0f5a2d}"/,
            ],
            ["21771a07-7dce-40b3-850e-386c1a0f5a2d", true, false, true, true, /"{21771A077DCE40B3850E386C1A0F5A2D}"/],
            ["21771a07-7dce-40b3-850e-386c1a0f5a2d", true, true, false, true, /"21771A07-7DCE-40B3-850E-386C1A0F5A2D"/],
            [
                "21771a07-7dce-40b3-850e-386c1a0f5a2d",
                true,
                true,
                true,
                true,
                /"{21771A07-7DCE-40B3-850E-386C1A0F5A2D}"/,
            ],
            ["21771a077dce40b3850e386c1a0f5a2d", false, false, false, false, /21771a077dce40b3850e386c1a0f5a2d/],
            ["21771a077dce40b3850e386c1a0f5a2d", true, false, false, false, /21771A077DCE40B3850E386C1A0F5A2D/],
            ["21771a077dce40b3850e386c1a0f5a2d", false, true, false, false, /21771a07-7dce-40b3-850e-386c1a0f5a2d/],
            ["21771a077dce40b3850e386c1a0f5a2d", false, false, true, false, /{21771a077dce40b3850e386c1a0f5a2d}/],
            ["21771a077dce40b3850e386c1a0f5a2d", false, false, false, true, /"21771a077dce40b3850e386c1a0f5a2d"/],
            ["21771a077dce40b3850e386c1a0f5a2d", true, true, false, false, /21771A07-7DCE-40B3-850E-386C1A0F5A2D/],
            ["21771a077dce40b3850e386c1a0f5a2d", false, true, true, false, /{21771a07-7dce-40b3-850e-386c1a0f5a2d}/],
            ["21771a077dce40b3850e386c1a0f5a2d", false, false, true, true, /"{21771a077dce40b3850e386c1a0f5a2d}"/],
            ["21771a077dce40b3850e386c1a0f5a2d", true, false, false, true, /"21771A077DCE40B3850E386C1A0F5A2D"/],
            ["21771a077dce40b3850e386c1a0f5a2d", true, true, true, false, /{21771A07-7DCE-40B3-850E-386C1A0F5A2D}/],
            ["21771a077dce40b3850e386c1a0f5a2d", false, true, true, true, /"{21771a07-7dce-40b3-850e-386c1a0f5a2d}"/],
            ["21771a077dce40b3850e386c1a0f5a2d", true, false, true, true, /"{21771A077DCE40B3850E386C1A0F5A2D}"/],
            ["21771a077dce40b3850e386c1a0f5a2d", true, true, false, true, /"21771A07-7DCE-40B3-850E-386C1A0F5A2D"/],
            ["21771a077dce40b3850e386c1a0f5a2d", true, true, true, true, /"{21771A07-7DCE-40B3-850E-386C1A0F5A2D}"/],
            ["{21771a07-7dce-40b3-850e-386c1a0f5a2d}", false, false, false, false, /21771a077dce40b3850e386c1a0f5a2d/],
            ["{21771a07-7dce-40b3-850e-386c1a0f5a2d}", true, false, false, false, /21771A077DCE40B3850E386C1A0F5A2D/],
            [
                "{21771a07-7dce-40b3-850e-386c1a0f5a2d}",
                false,
                true,
                false,
                false,
                /21771a07-7dce-40b3-850e-386c1a0f5a2d/,
            ],
            ["{21771a07-7dce-40b3-850e-386c1a0f5a2d}", false, false, true, false, /{21771a077dce40b3850e386c1a0f5a2d}/],
            ["{21771a07-7dce-40b3-850e-386c1a0f5a2d}", false, false, false, true, /"21771a077dce40b3850e386c1a0f5a2d"/],
            [
                "{21771a07-7dce-40b3-850e-386c1a0f5a2d}",
                true,
                true,
                false,
                false,
                /21771A07-7DCE-40B3-850E-386C1A0F5A2D/,
            ],
            [
                "{21771a07-7dce-40b3-850e-386c1a0f5a2d}",
                false,
                true,
                true,
                false,
                /{21771a07-7dce-40b3-850e-386c1a0f5a2d}/,
            ],
            [
                "{21771a07-7dce-40b3-850e-386c1a0f5a2d}",
                false,
                false,
                true,
                true,
                /"{21771a077dce40b3850e386c1a0f5a2d}"/,
            ],
            ["{21771a07-7dce-40b3-850e-386c1a0f5a2d}", true, false, false, true, /"21771A077DCE40B3850E386C1A0F5A2D"/],
            [
                "{21771a07-7dce-40b3-850e-386c1a0f5a2d}",
                true,
                true,
                true,
                false,
                /{21771A07-7DCE-40B3-850E-386C1A0F5A2D}/,
            ],
            [
                "{21771a07-7dce-40b3-850e-386c1a0f5a2d}",
                false,
                true,
                true,
                true,
                /"{21771a07-7dce-40b3-850e-386c1a0f5a2d}"/,
            ],
            ["{21771a07-7dce-40b3-850e-386c1a0f5a2d}", true, false, true, true, /"{21771A077DCE40B3850E386C1A0F5A2D}"/],
            [
                "{21771a07-7dce-40b3-850e-386c1a0f5a2d}",
                true,
                true,
                false,
                true,
                /"21771A07-7DCE-40B3-850E-386C1A0F5A2D"/,
            ],
            [
                "{21771a07-7dce-40b3-850e-386c1a0f5a2d}",
                true,
                true,
                true,
                true,
                /"{21771A07-7DCE-40B3-850E-386C1A0F5A2D}"/,
            ],
            ['"21771a07-7dce-40b3-850e-386c1a0f5a2d"', false, false, false, false, /21771a077dce40b3850e386c1a0f5a2d/],
            ['"21771a07-7dce-40b3-850e-386c1a0f5a2d"', true, false, false, false, /21771A077DCE40B3850E386C1A0F5A2D/],
            [
                '"21771a07-7dce-40b3-850e-386c1a0f5a2d"',
                false,
                true,
                false,
                false,
                /21771a07-7dce-40b3-850e-386c1a0f5a2d/,
            ],
            ['"21771a07-7dce-40b3-850e-386c1a0f5a2d"', false, false, true, false, /{21771a077dce40b3850e386c1a0f5a2d}/],
            ['"21771a07-7dce-40b3-850e-386c1a0f5a2d"', false, false, false, true, /"21771a077dce40b3850e386c1a0f5a2d"/],
            [
                '"21771a07-7dce-40b3-850e-386c1a0f5a2d"',
                true,
                true,
                false,
                false,
                /21771A07-7DCE-40B3-850E-386C1A0F5A2D/,
            ],
            [
                '"21771a07-7dce-40b3-850e-386c1a0f5a2d"',
                false,
                true,
                true,
                false,
                /{21771a07-7dce-40b3-850e-386c1a0f5a2d}/,
            ],
            [
                '"21771a07-7dce-40b3-850e-386c1a0f5a2d"',
                false,
                false,
                true,
                true,
                /"{21771a077dce40b3850e386c1a0f5a2d}"/,
            ],
            ['"21771a07-7dce-40b3-850e-386c1a0f5a2d"', true, false, false, true, /"21771A077DCE40B3850E386C1A0F5A2D"/],
            [
                '"21771a07-7dce-40b3-850e-386c1a0f5a2d"',
                true,
                true,
                true,
                false,
                /{21771A07-7DCE-40B3-850E-386C1A0F5A2D}/,
            ],
            [
                '"21771a07-7dce-40b3-850e-386c1a0f5a2d"',
                false,
                true,
                true,
                true,
                /"{21771a07-7dce-40b3-850e-386c1a0f5a2d}"/,
            ],
            ['"21771a07-7dce-40b3-850e-386c1a0f5a2d"', true, false, true, true, /"{21771A077DCE40B3850E386C1A0F5A2D}"/],
            [
                '"21771a07-7dce-40b3-850e-386c1a0f5a2d"',
                true,
                true,
                false,
                true,
                /"21771A07-7DCE-40B3-850E-386C1A0F5A2D"/,
            ],
            [
                '"21771a07-7dce-40b3-850e-386c1a0f5a2d"',
                true,
                true,
                true,
                true,
                /"{21771A07-7DCE-40B3-850E-386C1A0F5A2D}"/,
            ],
            ["21771A07-7DCE-40B3-850E-386C1A0F5A2D", false, false, false, false, /21771a077dce40b3850e386c1a0f5a2d/],
            ["21771A07-7DCE-40B3-850E-386C1A0F5A2D", true, false, false, false, /21771A077DCE40B3850E386C1A0F5A2D/],
            ["21771A07-7DCE-40B3-850E-386C1A0F5A2D", false, true, false, false, /21771a07-7dce-40b3-850e-386c1a0f5a2d/],
            ["21771A07-7DCE-40B3-850E-386C1A0F5A2D", false, false, true, false, /{21771a077dce40b3850e386c1a0f5a2d}/],
            ["21771A07-7DCE-40B3-850E-386C1A0F5A2D", false, false, false, true, /"21771a077dce40b3850e386c1a0f5a2d"/],
            ["21771A07-7DCE-40B3-850E-386C1A0F5A2D", true, true, false, false, /21771A07-7DCE-40B3-850E-386C1A0F5A2D/],
            [
                "21771A07-7DCE-40B3-850E-386C1A0F5A2D",
                false,
                true,
                true,
                false,
                /{21771a07-7dce-40b3-850e-386c1a0f5a2d}/,
            ],
            ["21771A07-7DCE-40B3-850E-386C1A0F5A2D", false, false, true, true, /"{21771a077dce40b3850e386c1a0f5a2d}"/],
            ["21771A07-7DCE-40B3-850E-386C1A0F5A2D", true, false, false, true, /"21771A077DCE40B3850E386C1A0F5A2D"/],
            ["21771A07-7DCE-40B3-850E-386C1A0F5A2D", true, true, true, false, /{21771A07-7DCE-40B3-850E-386C1A0F5A2D}/],
            [
                "21771A07-7DCE-40B3-850E-386C1A0F5A2D",
                false,
                true,
                true,
                true,
                /"{21771a07-7dce-40b3-850e-386c1a0f5a2d}"/,
            ],
            ["21771A07-7DCE-40B3-850E-386C1A0F5A2D", true, false, true, true, /"{21771A077DCE40B3850E386C1A0F5A2D}"/],
            ["21771A07-7DCE-40B3-850E-386C1A0F5A2D", true, true, false, true, /"21771A07-7DCE-40B3-850E-386C1A0F5A2D"/],
            [
                "21771A07-7DCE-40B3-850E-386C1A0F5A2D",
                true,
                true,
                true,
                true,
                /"{21771A07-7DCE-40B3-850E-386C1A0F5A2D}"/,
            ],
            ["21771A077DCE40B3850E386C1A0F5A2D", false, false, false, false, /21771a077dce40b3850e386c1a0f5a2d/],
            ["21771A077DCE40B3850E386C1A0F5A2D", true, false, false, false, /21771A077DCE40B3850E386C1A0F5A2D/],
            ["21771A077DCE40B3850E386C1A0F5A2D", false, true, false, false, /21771a07-7dce-40b3-850e-386c1a0f5a2d/],
            ["21771A077DCE40B3850E386C1A0F5A2D", false, false, true, false, /{21771a077dce40b3850e386c1a0f5a2d}/],
            ["21771A077DCE40B3850E386C1A0F5A2D", false, false, false, true, /"21771a077dce40b3850e386c1a0f5a2d"/],
            ["21771A077DCE40B3850E386C1A0F5A2D", true, true, false, false, /21771A07-7DCE-40B3-850E-386C1A0F5A2D/],
            ["21771A077DCE40B3850E386C1A0F5A2D", false, true, true, false, /{21771a07-7dce-40b3-850e-386c1a0f5a2d}/],
            ["21771A077DCE40B3850E386C1A0F5A2D", false, false, true, true, /"{21771a077dce40b3850e386c1a0f5a2d}"/],
            ["21771A077DCE40B3850E386C1A0F5A2D", true, false, false, true, /"21771A077DCE40B3850E386C1A0F5A2D"/],
            ["21771A077DCE40B3850E386C1A0F5A2D", true, true, true, false, /{21771A07-7DCE-40B3-850E-386C1A0F5A2D}/],
            ["21771A077DCE40B3850E386C1A0F5A2D", false, true, true, true, /"{21771a07-7dce-40b3-850e-386c1a0f5a2d}"/],
            ["21771A077DCE40B3850E386C1A0F5A2D", true, false, true, true, /"{21771A077DCE40B3850E386C1A0F5A2D}"/],
            ["21771A077DCE40B3850E386C1A0F5A2D", true, true, false, true, /"21771A07-7DCE-40B3-850E-386C1A0F5A2D"/],
            ["21771A077DCE40B3850E386C1A0F5A2D", true, true, true, true, /"{21771A07-7DCE-40B3-850E-386C1A0F5A2D}"/],
            ["{21771A07-7DCE-40B3-850E-386C1A0F5A2D}", false, false, false, false, /21771a077dce40b3850e386c1a0f5a2d/],
            ["{21771A07-7DCE-40B3-850E-386C1A0F5A2D}", true, false, false, false, /21771A077DCE40B3850E386C1A0F5A2D/],
            [
                "{21771A07-7DCE-40B3-850E-386C1A0F5A2D}",
                false,
                true,
                false,
                false,
                /21771a07-7dce-40b3-850e-386c1a0f5a2d/,
            ],
            ["{21771A07-7DCE-40B3-850E-386C1A0F5A2D}", false, false, true, false, /{21771a077dce40b3850e386c1a0f5a2d}/],
            ["{21771A07-7DCE-40B3-850E-386C1A0F5A2D}", false, false, false, true, /"21771a077dce40b3850e386c1a0f5a2d"/],
            [
                "{21771A07-7DCE-40B3-850E-386C1A0F5A2D}",
                true,
                true,
                false,
                false,
                /21771A07-7DCE-40B3-850E-386C1A0F5A2D/,
            ],
            [
                "{21771A07-7DCE-40B3-850E-386C1A0F5A2D}",
                false,
                true,
                true,
                false,
                /{21771a07-7dce-40b3-850e-386c1a0f5a2d}/,
            ],
            [
                "{21771A07-7DCE-40B3-850E-386C1A0F5A2D}",
                false,
                false,
                true,
                true,
                /"{21771a077dce40b3850e386c1a0f5a2d}"/,
            ],
            ["{21771A07-7DCE-40B3-850E-386C1A0F5A2D}", true, false, false, true, /"21771A077DCE40B3850E386C1A0F5A2D"/],
            [
                "{21771A07-7DCE-40B3-850E-386C1A0F5A2D}",
                true,
                true,
                true,
                false,
                /{21771A07-7DCE-40B3-850E-386C1A0F5A2D}/,
            ],
            [
                "{21771A07-7DCE-40B3-850E-386C1A0F5A2D}",
                false,
                true,
                true,
                true,
                /"{21771a07-7dce-40b3-850e-386c1a0f5a2d}"/,
            ],
            ["{21771A07-7DCE-40B3-850E-386C1A0F5A2D}", true, false, true, true, /"{21771A077DCE40B3850E386C1A0F5A2D}"/],
            [
                "{21771A07-7DCE-40B3-850E-386C1A0F5A2D}",
                true,
                true,
                false,
                true,
                /"21771A07-7DCE-40B3-850E-386C1A0F5A2D"/,
            ],
            [
                "{21771A07-7DCE-40B3-850E-386C1A0F5A2D}",
                true,
                true,
                true,
                true,
                /"{21771A07-7DCE-40B3-850E-386C1A0F5A2D}"/,
            ],
            ['"21771A07-7DCE-40B3-850E-386C1A0F5A2D"', false, false, false, false, /21771a077dce40b3850e386c1a0f5a2d/],
            ['"21771A07-7DCE-40B3-850E-386C1A0F5A2D"', true, false, false, false, /21771A077DCE40B3850E386C1A0F5A2D/],
            [
                '"21771A07-7DCE-40B3-850E-386C1A0F5A2D"',
                false,
                true,
                false,
                false,
                /21771a07-7dce-40b3-850e-386c1a0f5a2d/,
            ],
            ['"21771A07-7DCE-40B3-850E-386C1A0F5A2D"', false, false, true, false, /{21771a077dce40b3850e386c1a0f5a2d}/],
            ['"21771A07-7DCE-40B3-850E-386C1A0F5A2D"', false, false, false, true, /"21771a077dce40b3850e386c1a0f5a2d"/],
            [
                '"21771A07-7DCE-40B3-850E-386C1A0F5A2D"',
                true,
                true,
                false,
                false,
                /21771A07-7DCE-40B3-850E-386C1A0F5A2D/,
            ],
            [
                '"21771A07-7DCE-40B3-850E-386C1A0F5A2D"',
                false,
                true,
                true,
                false,
                /{21771a07-7dce-40b3-850e-386c1a0f5a2d}/,
            ],
            [
                '"21771A07-7DCE-40B3-850E-386C1A0F5A2D"',
                false,
                false,
                true,
                true,
                /"{21771a077dce40b3850e386c1a0f5a2d}"/,
            ],
            ['"21771A07-7DCE-40B3-850E-386C1A0F5A2D"', true, false, false, true, /"21771A077DCE40B3850E386C1A0F5A2D"/],
            [
                '"21771A07-7DCE-40B3-850E-386C1A0F5A2D"',
                true,
                true,
                true,
                false,
                /{21771A07-7DCE-40B3-850E-386C1A0F5A2D}/,
            ],
            [
                '"21771A07-7DCE-40B3-850E-386C1A0F5A2D"',
                false,
                true,
                true,
                true,
                /"{21771a07-7dce-40b3-850e-386c1a0f5a2d}"/,
            ],
            ['"21771A07-7DCE-40B3-850E-386C1A0F5A2D"', true, false, true, true, /"{21771A077DCE40B3850E386C1A0F5A2D}"/],
            [
                '"21771A07-7DCE-40B3-850E-386C1A0F5A2D"',
                true,
                true,
                false,
                true,
                /"21771A07-7DCE-40B3-850E-386C1A0F5A2D"/,
            ],
            [
                '"21771A07-7DCE-40B3-850E-386C1A0F5A2D"',
                true,
                true,
                true,
                true,
                /"{21771A07-7DCE-40B3-850E-386C1A0F5A2D}"/,
            ],
        ])("should format uuid correctly", (uuid, uppercase, hyphens, braces, quotes, expectedPattern) => {
            const formattedUuid = UuidGenerator.reformat(uuid, {
                uppercase: uppercase,
                hyphens: hyphens,
                braces: braces,
                quotes: quotes,
            });
            expect(formattedUuid).toMatch(expectedPattern);
        });
    });
});
