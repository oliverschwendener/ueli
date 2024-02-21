import type { AssetPathResolver } from "@Core/AssetPathResolver";
import type { OperatingSystem } from "@common/Core";
import type { NativeTheme } from "electron";

export const getTrayIconImage = (
    assetPathResolver: AssetPathResolver,
    operatingSystem: OperatingSystem,
    nativeTheme: NativeTheme,
) => {
    const fileNames: Record<OperatingSystem, { onLightBackground: string; onDarkBackground: string }> = {
        Linux: {
            onDarkBackground: "ueli-icon-white-on-transparent.png",
            onLightBackground: "ueli-icon-black-on-transparent.png",
        },
        macOS: {
            onDarkBackground: "ueliTemplate.png",
            onLightBackground: "ueliTemplate.png",
        },
        Windows: {
            onLightBackground: "app-icon-light-transparent.png",
            onDarkBackground: "app-icon-dark-transparent.png",
        },
    };

    const fileName = nativeTheme.shouldUseDarkColors
        ? fileNames[operatingSystem].onDarkBackground
        : fileNames[operatingSystem].onLightBackground;

    return assetPathResolver.getModuleAssetPath("TrayIcon", fileName);
};
