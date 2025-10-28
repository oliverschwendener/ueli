import type { AssetPathResolver } from "@Core/AssetPathResolver";
import type { NativeTheme } from "electron";
import { describe, expect, it, vi } from "vitest";
import { AppIconFilePathResolver } from "./AppIconFilePathResolver";

describe(AppIconFilePathResolver, () => {
    it("should return the correct app icon file path on Windows' dark theme", () => {
        const getModuleAssetPathMock = vi.fn().mockReturnValue("windows-dark-theme-icon.png");
        const assetPathResolver = <AssetPathResolver>{ getModuleAssetPath: (m, a) => getModuleAssetPathMock(m, a) };
        const nativeTheme = <NativeTheme>{ shouldUseDarkColors: true };

        const appIconFilePathResolver = new AppIconFilePathResolver(nativeTheme, assetPathResolver, "Windows");

        expect(appIconFilePathResolver.getAppIconFilePath()).toBe("windows-dark-theme-icon.png");
        expect(getModuleAssetPathMock).toHaveBeenCalledWith("AppIconFilePathResolver", "app-icon-dark-transparent.png");
    });

    it("should return the correct app icon file path on Windows' light theme", () => {
        const getModuleAssetPathMock = vi.fn().mockReturnValue("windows-light-theme-icon.png");
        const assetPathResolver = <AssetPathResolver>{ getModuleAssetPath: (m, a) => getModuleAssetPathMock(m, a) };
        const nativeTheme = <NativeTheme>{ shouldUseDarkColors: false };

        const appIconFilePathResolver = new AppIconFilePathResolver(nativeTheme, assetPathResolver, "Windows");

        expect(appIconFilePathResolver.getAppIconFilePath()).toBe("windows-light-theme-icon.png");
        expect(getModuleAssetPathMock).toHaveBeenCalledWith("AppIconFilePathResolver", "app-icon-light-transparent.png");
    });

    it("should return the correct app icon file path on macOS' dark theme", () => {
        const getModuleAssetPathMock = vi.fn().mockReturnValue("macos-dark-theme-icon.png");
        const assetPathResolver = <AssetPathResolver>{ getModuleAssetPath: (m, a) => getModuleAssetPathMock(m, a) };
        const nativeTheme = <NativeTheme>{ shouldUseDarkColors: true };

        const appIconFilePathResolver = new AppIconFilePathResolver(nativeTheme, assetPathResolver, "macOS");

        expect(appIconFilePathResolver.getAppIconFilePath()).toBe("macos-dark-theme-icon.png");
        expect(getModuleAssetPathMock).toHaveBeenCalledWith("AppIconFilePathResolver", "app-icon-dark.png");
    });

    it("should return the correct app icon file path on macOS' light theme", () => {
        const getModuleAssetPathMock = vi.fn().mockReturnValue("macos-light-theme-icon.png");
        const assetPathResolver = <AssetPathResolver>{ getModuleAssetPath: (m, a) => getModuleAssetPathMock(m, a) };
        const nativeTheme = <NativeTheme>{ shouldUseDarkColors: false };

        const appIconFilePathResolver = new AppIconFilePathResolver(nativeTheme, assetPathResolver, "macOS");

        expect(appIconFilePathResolver.getAppIconFilePath()).toBe("macos-light-theme-icon.png");
        expect(getModuleAssetPathMock).toHaveBeenCalledWith("AppIconFilePathResolver", "app-icon-light.png");
    });

    it("should return the correct app icon file path on Linux' dark theme", () => {
        const getModuleAssetPathMock = vi.fn().mockReturnValue("linux-dark-theme-icon.png");
        const assetPathResolver = <AssetPathResolver>{ getModuleAssetPath: (m, a) => getModuleAssetPathMock(m, a) };
        const nativeTheme = <NativeTheme>{ shouldUseDarkColors: true };

        const appIconFilePathResolver = new AppIconFilePathResolver(nativeTheme, assetPathResolver, "Linux");

        expect(appIconFilePathResolver.getAppIconFilePath()).toBe("linux-dark-theme-icon.png");
        expect(getModuleAssetPathMock).toHaveBeenCalledWith("AppIconFilePathResolver", "app-icon-dark.png");
    });

    it("should return the correct app icon file path on Linux' light theme", () => {
        const getModuleAssetPathMock = vi.fn().mockReturnValue("linux-light-theme-icon.png");
        const assetPathResolver = <AssetPathResolver>{ getModuleAssetPath: (m, a) => getModuleAssetPathMock(m, a) };
        const nativeTheme = <NativeTheme>{ shouldUseDarkColors: false };

        const appIconFilePathResolver = new AppIconFilePathResolver(nativeTheme, assetPathResolver, "Linux");

        expect(appIconFilePathResolver.getAppIconFilePath()).toBe("linux-light-theme-icon.png");
        expect(getModuleAssetPathMock).toHaveBeenCalledWith("AppIconFilePathResolver", "app-icon-light.png");
    });
});
