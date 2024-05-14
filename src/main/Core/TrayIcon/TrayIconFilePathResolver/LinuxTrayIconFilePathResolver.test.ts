import type { AssetPathResolver } from "@Core/AssetPathResolver";
import type { NativeTheme } from "electron";
import { describe, expect, it, vi } from "vitest";
import { LinuxTrayIconFilePathResolver } from "./LinuxTrayIconFilePathResolver";

describe(LinuxTrayIconFilePathResolver, () => {
    describe(LinuxTrayIconFilePathResolver.prototype.resolve, () => {
        const testResolve = ({
            shouldUseDarkColors,
            expectedAssetFileName,
        }: {
            shouldUseDarkColors: boolean;
            expectedAssetFileName: string;
        }) => {
            const nativeTheme = <NativeTheme>{ shouldUseDarkColors };
            const getModuleAssetPathMock = vi.fn().mockReturnValue("assetPath");
            const assetPathResolver = <AssetPathResolver>{ getModuleAssetPath: (m, f) => getModuleAssetPathMock(m, f) };

            expect(new LinuxTrayIconFilePathResolver(nativeTheme, assetPathResolver).resolve()).toBe("assetPath");
            expect(getModuleAssetPathMock).toHaveBeenCalledOnce();
            expect(getModuleAssetPathMock).toHaveBeenCalledWith("TrayIcon", expectedAssetFileName);
        };

        it("should return file path to 'ueli-icon-black-on-transparent.png' when the native theme is light", () =>
            testResolve({
                shouldUseDarkColors: false,
                expectedAssetFileName: "ueli-icon-black-on-transparent.png",
            }));

        it("should return file path to 'ueli-icon-white-on-transparent.png' when the native theme is dark", () =>
            testResolve({
                shouldUseDarkColors: true,
                expectedAssetFileName: "ueli-icon-white-on-transparent.png",
            }));
    });
});
