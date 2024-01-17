import { join } from "path";
import { describe, expect, it } from "vitest";
import { AssetPathResolver } from "./AssetPathResolver";

describe(AssetPathResolver, () => {
    it("should return the correct extension asset path", () => {
        expect(new AssetPathResolver().getExtensionAssetPath("extensionId1", "myAssetFileName")).toBe(
            join(__dirname, "..", "assets", "Extensions", "extensionId1", "myAssetFileName"),
        );
    });

    it("should return the correct module asset path", () => {
        expect(new AssetPathResolver().getModuleAssetPath("moduleId1", "myAssetFileName")).toBe(
            join(__dirname, "..", "assets", "Core", "moduleId1", "myAssetFileName"),
        );
    });
});
