export interface ExtensionAssetPathResolver {
    getAssetFilePath(extensionId: string, assetFileName: string): string;
}
