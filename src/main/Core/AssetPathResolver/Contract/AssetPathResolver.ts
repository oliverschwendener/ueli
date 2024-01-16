export interface AssetPathResolver {
    getModuleAssetPath(moduleId: string, assetFileName: string): string;
    getExtensionAssetPath(extensionId: string, assetFileName: string): string;
}
