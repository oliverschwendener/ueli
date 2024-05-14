import type { AssetPathResolver } from "@Core/AssetPathResolver";
import type { NativeTheme } from "electron";
import { describe, expect, it, vi } from "vitest";
import { WindowsTrayIconFilePathResolver } from "./WindowsTrayIconFilePathResolver";

describe(WindowsTrayIconFilePathResolver, () => {
    describe(WindowsTrayIconFilePathResolver.prototype.resolve, () => {
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

            expect(new WindowsTrayIconFilePathResolver(nativeTheme, assetPathResolver).resolve()).toBe("assetPath");
            expect(getModuleAssetPathMock).toHaveBeenCalledOnce();
            expect(getModuleAssetPathMock).toHaveBeenCalledWith("TrayIcon", expectedAssetFileName);
        };

        it("should return file path to 'app-icon-light-transparent.png' when the native theme is light", () =>
            testResolve({
                shouldUseDarkColors: false,
                expectedAssetFileName: "app-icon-light-transparent.png",
            }));

        it("should return file path to 'app-icon-dark-transparent.png' when the native theme is dark", () =>
            testResolve({
                shouldUseDarkColors: true,
                expectedAssetFileName: "app-icon-dark-transparent.png",
            }));
    });
});
