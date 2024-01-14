import { describe, expect, it } from "vitest";
import { getExtensionSettingKey } from "./getExtensionSettingKey";

describe(getExtensionSettingKey, () => {
    it("should return the correct key for a given extension id and setting key", () => {
        expect(getExtensionSettingKey("extension1", "key1")).toBe(`extension[extension1].key1`);
    });
});
