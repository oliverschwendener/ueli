import { describe, expect, it } from "vitest";
import { Base64Converter } from "./Base64Converter";

describe(Base64Converter, () => {
    describe(Base64Converter.encode, () => {
        it("should return the correct base64 encoded value of a string", () => {
            expect(Base64Converter.encode("Test:1886")).toBe("VGVzdDoxODg2");
        });

        it("should return the correct base64 encoded value of a string containing non-ASCII characters", () => {
            expect(Base64Converter.encode("Zürich ist schön.")).toBe("WsO8cmljaCBpc3Qgc2Now7ZuLg==");
        });
    });

    describe(Base64Converter.decode, () => {
        it("should return the correct decoded value of a base64 string", () => {
            expect(Base64Converter.decode("VGhpcyBpcyBhIHRlc3Qh")).toBe("This is a test!");
        });

        it("should return the correct decoded value of a base64 string containing non-ASCII characters", () => {
            expect(Base64Converter.decode("4pyF8J+RjQ==")).toBe("✅👍");
        });
    });
});
