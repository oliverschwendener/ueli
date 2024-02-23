import type { AssetPathResolver } from "@Core/AssetPathResolver";
import type { NativeTheme } from "electron";
import { describe, expect, it, vi } from "vitest";
import { getAppIconFilePath } from "./getAppIconFilePath";

describe(getAppIconFilePath, () => {
    it("it should return the correct app icon file path on Windows' dark theme", () => {
        const getModuleAssetPathMock = vi.fn().mockReturnValue("windows-dark-theme-icon.png");
        const assetPathResolver = <AssetPathResolver>{ getModuleAssetPath: (m, a) => getModuleAssetPathMock(m, a) };
        const nativeTheme = <NativeTheme>{ shouldUseDarkColors: true };

        expect(getAppIconFilePath(nativeTheme, assetPathResolver, "Windows")).toBe("windows-dark-theme-icon.png");
        expect(getModuleAssetPathMock).toHaveBeenCalledWith("BrowserWindow", "app-icon-dark-transparent.png");
    });

    it("it should return the correct app icon file path on Windows' light theme", () => {
        const getModuleAssetPathMock = vi.fn().mockReturnValue("windows-light-theme-icon.png");
        const assetPathResolver = <AssetPathResolver>{ getModuleAssetPath: (m, a) => getModuleAssetPathMock(m, a) };
        const nativeTheme = <NativeTheme>{ shouldUseDarkColors: false };

        expect(getAppIconFilePath(nativeTheme, assetPathResolver, "Windows")).toBe("windows-light-theme-icon.png");
        expect(getModuleAssetPathMock).toHaveBeenCalledWith("BrowserWindow", "app-icon-light-transparent.png");
    });

    it("it should return the correct app icon file path on macOS' dark theme", () => {
        const getModuleAssetPathMock = vi.fn().mockReturnValue("macos-dark-theme-icon.png");
        const assetPathResolver = <AssetPathResolver>{ getModuleAssetPath: (m, a) => getModuleAssetPathMock(m, a) };
        const nativeTheme = <NativeTheme>{ shouldUseDarkColors: true };

        expect(getAppIconFilePath(nativeTheme, assetPathResolver, "macOS")).toBe("macos-dark-theme-icon.png");
        expect(getModuleAssetPathMock).toHaveBeenCalledWith("BrowserWindow", "app-icon-dark.png");
    });

    it("it should return the correct app icon file path on macOS' light theme", () => {
        const getModuleAssetPathMock = vi.fn().mockReturnValue("macos-light-theme-icon.png");
        const assetPathResolver = <AssetPathResolver>{ getModuleAssetPath: (m, a) => getModuleAssetPathMock(m, a) };
        const nativeTheme = <NativeTheme>{ shouldUseDarkColors: false };

        expect(getAppIconFilePath(nativeTheme, assetPathResolver, "macOS")).toBe("macos-light-theme-icon.png");
        expect(getModuleAssetPathMock).toHaveBeenCalledWith("BrowserWindow", "app-icon-light.png");
    });

    it("it should return the correct app icon file path on Linux' dark theme", () => {
        const getModuleAssetPathMock = vi.fn().mockReturnValue("linux-dark-theme-icon.png");
        const assetPathResolver = <AssetPathResolver>{ getModuleAssetPath: (m, a) => getModuleAssetPathMock(m, a) };
        const nativeTheme = <NativeTheme>{ shouldUseDarkColors: true };

        expect(getAppIconFilePath(nativeTheme, assetPathResolver, "macOS")).toBe("linux-dark-theme-icon.png");
        expect(getModuleAssetPathMock).toHaveBeenCalledWith("BrowserWindow", "app-icon-dark.png");
    });

    it("it should return the correct app icon file path on Linux' light theme", () => {
        const getModuleAssetPathMock = vi.fn().mockReturnValue("linux-light-theme-icon.png");
        const assetPathResolver = <AssetPathResolver>{ getModuleAssetPath: (m, a) => getModuleAssetPathMock(m, a) };
        const nativeTheme = <NativeTheme>{ shouldUseDarkColors: false };

        expect(getAppIconFilePath(nativeTheme, assetPathResolver, "macOS")).toBe("linux-light-theme-icon.png");
        expect(getModuleAssetPathMock).toHaveBeenCalledWith("BrowserWindow", "app-icon-light.png");
    });
});
