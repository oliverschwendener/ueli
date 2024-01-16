import { join } from "path";
import type { AssetPathResolver as AssetPathResolverInterface } from "./Contract";

export class AssetPathResolver implements AssetPathResolverInterface {
    public getExtensionAssetPath(extensionId: string, assetFileName: string): string {
        return join(__dirname, "..", "assets", "Extensions", extensionId, assetFileName);
    }

    public getModuleAssetPath(moduleName: string, assetFileName: string): string {
        return join(__dirname, "..", "assets", "Core", moduleName, assetFileName);
    }
}
