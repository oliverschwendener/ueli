import type { AssetPathResolver } from "@Core/AssetPathResolver";
import type { OperatingSystem } from "@common/Core";
import type { NativeTheme } from "electron";
import type { AppIconFilePathResolver as AppIconFilePathResolverInterface } from "./Contract";

export class AppIconFilePathResolver implements AppIconFilePathResolverInterface {
    public constructor(
        private readonly nativeTheme: NativeTheme,
        private readonly assetPathResolver: AssetPathResolver,
        private readonly operatingSystem: OperatingSystem,
    ) {}

    public resolve(): string {
        const fileNames: Record<OperatingSystem, { dark: string; light: string }> = {
            Linux: { dark: "app-icon-dark.png", light: "app-icon-light.png" },
            macOS: { dark: "app-icon-dark.png", light: "app-icon-light.png" },
            Windows: { dark: "app-icon-dark-transparent.png", light: "app-icon-light-transparent.png" },
        };

        const filename = this.nativeTheme.shouldUseDarkColors
            ? fileNames[this.operatingSystem].dark
            : fileNames[this.operatingSystem].light;

        return this.assetPathResolver.getModuleAssetPath("AppIconFilePathResolver", filename);
    }
}
