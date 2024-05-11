import type { AssetPathResolver } from "@Core/AssetPathResolver";
import type { FileSystemUtility } from "@Core/FileSystemUtility";
import type { Image } from "@common/Core/Image";
import type { App } from "electron";
import { join } from "path";
import type { FileIconExtractor } from "../FileIconExtractor";

export class WindowsFolderIconExtractor implements FileIconExtractor {
    private readonly folderPaths: Record<string, string>;

    public constructor(
        private readonly assetPathResolver: AssetPathResolver,
        private readonly fileSystemUtility: FileSystemUtility,
        app: App,
    ) {
        const homeFolderPath = app.getPath("home");

        // Extracted from "C:\Windows\SystemResources\imageres.dll.mun"
        this.folderPaths = {
            [join(homeFolderPath, "3D Objects")]: "3DObjectsFolderIcon.ico",
            [join(homeFolderPath, "Desktop")]: "DesktopFolderIcon.ico",
            [join(homeFolderPath, "Documents")]: "DocumentsFolderIcon.ico",
            [join(homeFolderPath, "Downloads")]: "DownloadsFolderIcon.ico",
            [join(homeFolderPath, "Music")]: "MusicFolderIcon.ico",
            [join(homeFolderPath, "OneDrive")]: "OneDriveFolderIcon.ico",
            [join(homeFolderPath, "Pictures")]: "PicturesFolderIcon.ico",
            [join(homeFolderPath, "Videos")]: "VideosFolderIcon.ico",
        };
    }

    public matchesFilePath(filePath: string) {
        return this.fileSystemUtility.isDirectory(filePath);
    }

    public async extractFileIcon(filePath: string): Promise<Image> {
        const assetFileName = Object.keys(this.folderPaths).includes(filePath)
            ? this.folderPaths[filePath]
            : "GenericFolderIcon.ico";

        return {
            url: `file://${this.assetPathResolver.getModuleAssetPath("FileImageGenerator", join("Windows", assetFileName))}`,
        };
    }

    public async extractFileIcons(filePaths: string[]): Promise<Record<string, Image>> {
        const result: Record<string, Image> = {};

        for (const filePath of filePaths) {
            result[filePath] = await this.extractFileIcon(filePath);
        }

        return result;
    }
}
