import { join } from "path";
import type { AssetPathResolver as AssetPathResolverInterface } from "./Contract";

export class AssetPathResolver implements AssetPathResolverInterface {
    public getExtensionAssetPath(extensionId: string, assetFileName: string): string {
        return join(this.getAssetBasePath(), "Extensions", extensionId, assetFileName);
    }

    public getModuleAssetPath(moduleName: string, assetFileName: string): string {
        return join(this.getAssetBasePath(), "Core", moduleName, assetFileName);
    }

    private getAssetBasePath() {
        return join(__dirname, "..", "assets");
    }
}
