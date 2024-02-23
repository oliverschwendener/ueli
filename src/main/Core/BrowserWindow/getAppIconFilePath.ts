import type { AssetPathResolver } from "@Core/AssetPathResolver";
import type { OperatingSystem } from "@common/Core";
import type { NativeTheme } from "electron";

export const getAppIconFilePath = (
    nativeTheme: NativeTheme,
    assetPathResolver: AssetPathResolver,
    operatingSystem: OperatingSystem,
): string => {
    const fileNames: Record<OperatingSystem, { dark: string; light: string }> = {
        Linux: { dark: "app-icon-dark.png", light: "app-icon-light.png" },
        macOS: { dark: "app-icon-dark.png", light: "app-icon-light.png" },
        Windows: { dark: "app-icon-dark-transparent.png", light: "app-icon-light-transparent.png" },
    };

    const filename = nativeTheme.shouldUseDarkColors
        ? fileNames[operatingSystem].dark
        : fileNames[operatingSystem].light;

    return assetPathResolver.getModuleAssetPath("BrowserWindow", filename);
};
