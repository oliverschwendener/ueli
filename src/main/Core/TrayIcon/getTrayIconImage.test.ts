import type { AssetPathResolver } from "@Core/AssetPathResolver";
import type { OperatingSystem } from "@common/Core";
import type { NativeTheme } from "electron";
import { describe, expect, it, vi } from "vitest";
import { getTrayIconImage } from "./getTrayIconImage";

describe(getTrayIconImage, () => {
    const testGetTrayIconImage = ({
        shouldUseDarkColors,
        operatingSystem,
        expectedFileName,
    }: {
        shouldUseDarkColors: boolean;
        operatingSystem: OperatingSystem;
        expectedFileName: string;
    }) => {
        const assetPath = "myAssetPath";
        const getModuleAssetPathMock = vi.fn().mockReturnValue(assetPath);

        const assetPathResolver = <AssetPathResolver>{
            getModuleAssetPath: (moduleName, fileName) => getModuleAssetPathMock(moduleName, fileName),
        };

        const nativeTheme = <NativeTheme>{ shouldUseDarkColors };

        expect(getTrayIconImage(assetPathResolver, operatingSystem, nativeTheme)).toBe(assetPath);
        expect(getModuleAssetPathMock).toHaveBeenCalledOnce();
        expect(getModuleAssetPathMock).toHaveBeenCalledWith("TrayIcon", expectedFileName);
    };

    it("should return the correct tray icon image", () => {
        testGetTrayIconImage({
            expectedFileName: "ueli-icon-white-on-transparent.ico",
            operatingSystem: "Windows",
            shouldUseDarkColors: true,
        });

        testGetTrayIconImage({
            expectedFileName: "ueli-icon-black-on-transparent.ico",
            operatingSystem: "Windows",
            shouldUseDarkColors: false,
        });

        testGetTrayIconImage({
            expectedFileName: "ueliTemplate.png",
            operatingSystem: "macOS",
            shouldUseDarkColors: true,
        });

        testGetTrayIconImage({
            expectedFileName: "ueliTemplate.png",
            operatingSystem: "macOS",
            shouldUseDarkColors: false,
        });

        testGetTrayIconImage({
            expectedFileName: "ueli-icon-white-on-transparent.png",
            operatingSystem: "Linux",
            shouldUseDarkColors: true,
        });

        testGetTrayIconImage({
            expectedFileName: "ueli-icon-black-on-transparent.png",
            operatingSystem: "Linux",
            shouldUseDarkColors: false,
        });
    });
});
