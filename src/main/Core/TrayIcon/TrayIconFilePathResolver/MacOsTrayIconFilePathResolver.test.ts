import type { AssetPathResolver } from "@Core/AssetPathResolver";
import { describe, expect, it, vi } from "vitest";
import { MacOsTrayIconFilePathResolver } from "./MacOsTrayIconFilePathResolver";

describe(MacOsTrayIconFilePathResolver, () => {
    describe(MacOsTrayIconFilePathResolver.prototype.resolve, () => {
        it("should return file path to 'ueliTemplate.png'", () => {
            const getModuleAssetPathMock = vi.fn().mockReturnValue("assetPath");
            const assetPathResolver = <AssetPathResolver>{ getModuleAssetPath: (m, f) => getModuleAssetPathMock(m, f) };

            expect(new MacOsTrayIconFilePathResolver(assetPathResolver).resolve()).toBe("assetPath");
            expect(getModuleAssetPathMock).toHaveBeenCalledOnce();
            expect(getModuleAssetPathMock).toHaveBeenCalledWith("TrayIcon", "ueliTemplate.png");
        });
    });
});
