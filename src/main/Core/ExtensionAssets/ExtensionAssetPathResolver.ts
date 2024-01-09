import { join } from "path";
import type { ExtensionAssetPathResolver as ExtensionAssetPathResolverInterface } from "./Contract";

export class ExtensionAssetPathResolver implements ExtensionAssetPathResolverInterface {
    public getAssetFilePath(extensionId: string, assetFileName: string): string {
        return join(__dirname, "..", "assets", "Extensions", extensionId, assetFileName);
    }
}
