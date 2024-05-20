import { beforeEach } from "node:test";
import { describe, expect, it, vi } from "vitest";
import { isValidFilePath } from "./isValidFilePath";

describe(isValidFilePath, () => {
    beforeEach(() => {
        vi.resetAllMocks();
    });

    it("should return true for an existing file path", () => {
        vi.stubGlobal("window", { ContextBridge: { fileExists: () => true } });
        expect(isValidFilePath("test")).toBe(true);
    });

    it("should return false for an inexisting file path", () => {
        vi.stubGlobal("window", { ContextBridge: { fileExists: () => false } });
        expect(isValidFilePath("test")).toBe(false);
    });
});
