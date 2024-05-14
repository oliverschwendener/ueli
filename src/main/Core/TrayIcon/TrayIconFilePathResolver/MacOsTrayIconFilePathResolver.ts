import type { AssetPathResolver } from "@Core/AssetPathResolver";
import type { TrayIconFilePathResolver } from "./TrayIconFilePathResolver";

export class MacOsTrayIconFilePathResolver implements TrayIconFilePathResolver {
    public constructor(private readonly assetPathResolver: AssetPathResolver) {}

    public resolve(): string {
        return this.assetPathResolver.getModuleAssetPath("TrayIcon", "ueliTemplate.png");
    }
}
