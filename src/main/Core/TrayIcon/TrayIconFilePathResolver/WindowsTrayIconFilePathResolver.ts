import type { AssetPathResolver } from "@Core/AssetPathResolver";
import type { NativeTheme } from "electron";
import type { TrayIconFilePathResolver } from "./TrayIconFilePathResolver";

export class WindowsTrayIconFilePathResolver implements TrayIconFilePathResolver {
    private readonly filenames = {
        onLightBackground: "app-icon-light-transparent.png",
        onDarkBackground: "app-icon-dark-transparent.png",
    };

    public constructor(
        private readonly nativeTheme: NativeTheme,
        private readonly assetPathResolver: AssetPathResolver,
    ) {}

    public resolve(): string {
        const fileName = this.nativeTheme.shouldUseDarkColors
            ? this.filenames.onDarkBackground
            : this.filenames.onLightBackground;

        return this.assetPathResolver.getModuleAssetPath("TrayIcon", fileName);
    }
}
