import type { AssetPathResolver } from "@Core/AssetPathResolver";
import type { FileSystemUtility } from "@Core/FileSystemUtility";
import type { Image } from "@common/Core/Image";
import type { FileIconExtractor } from "./FileIconExtractor";

export class WindowsFolderIconExtractor implements FileIconExtractor {
    public constructor(
        private readonly assetPathResolver: AssetPathResolver,
        private readonly fileSystemUtility: FileSystemUtility,
    ) {}

    public machtes(filePath: string) {
        return this.fileSystemUtility.isDirectory(filePath);
    }

    public async extractFileIcon() {
        return this.getGenericFolderImage();
    }

    public async extractFileIcons(filePaths: string[]) {
        const result: Record<string, Image> = {};

        for (const filePath of filePaths) {
            result[filePath] = this.getGenericFolderImage();
        }

        return result;
    }

    private getGenericFolderImage(): Image {
        return {
            url: `file://${this.assetPathResolver.getModuleAssetPath("FileImageGenerator", "windows-generic-folder.png")}`,
        };
    }
}
