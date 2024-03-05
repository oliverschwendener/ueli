/**
 * Module to resolve asset paths for modules and extensions.
 */
export interface AssetPathResolver {
    /**
     * Resolves the path to an asset file for a Core module.
     * @param moduleId The ID of the module, e.g.: "BrowserWindow"
     * @param assetFileName The name of the asset file, e.g.: "icon.png"
     * @returns The resolved path to the asset file, e.g.: "C:\example\BrowserWindow\icon.png"
     */
    getModuleAssetPath(moduleId: string, assetFileName: string): string;

    /**
     * Resolves the path to an asset file for an extension.
     * @param extensionId The ID of the extension, e.g.: "MyCustomExtension"
     * @param assetFileName The name of the asset file, e.g.: "icon.png"
     * @returns The resolved path to the asset file, e.g.: "C:\example\MyCustomExtension\icon.png"
     */
    getExtensionAssetPath(extensionId: string, assetFileName: string): string;
}
