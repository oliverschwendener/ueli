import type { AssetPathResolver } from "@Core/AssetPathResolver";
import type { FileSystemUtility } from "@Core/FileSystemUtility";
import type { Image } from "@common/Core/Image";
import type { App } from "electron";
import { join } from "path";
import type { FileIconExtractor } from "../FileIconExtractor";

export class MacOsFolderIconExtractor implements FileIconExtractor {
    private readonly folderPaths: Record<string, string>;

    public constructor(
        private readonly assetPathResolver: AssetPathResolver,
        private readonly fileSystemUtility: FileSystemUtility,
        app: App,
    ) {
        const homeFolderPath = app.getPath("home");

        this.folderPaths = {
            [homeFolderPath]: "HomeFolderIcon.png",
            [join(homeFolderPath, "Applications")]: "ApplicationsFolderIcon.png",
            [join(homeFolderPath, "Desktop")]: "DesktopFolderIcon.png",
            [join(homeFolderPath, "Documents")]: "DocumentsFolderIcon.png",
            [join(homeFolderPath, "Downloads")]: "DownloadsFolderIcon.png",
            [join(homeFolderPath, "Library")]: "LibraryFolderIcon.png",
            [join(homeFolderPath, "Movies")]: "MovieFolderIcon.png",
            [join(homeFolderPath, "Music")]: "MusicFolderIcon.png",
            [join(homeFolderPath, "Pictures")]: "PicturesFolderIcon.png",
            [join(homeFolderPath, "Public")]: "PublicFolderIcon.png",
            [join("/", "Applications")]: "ApplicationsFolderIcon.png",
            [join("/", "Library")]: "LibraryFolderIcon.png",
            [join("/", "System", "Applications")]: "ApplicationsFolderIcon.png",
            ["/Users"]: "UsersFolderIcon.png",
            ["/System"]: "SystemFolderIcon.png",
            ["/System/Library"]: "LibraryFolderIcon.png",
        };
    }

    public matchesFilePath(filePath: string) {
        return (
            Object.keys(this.folderPaths).some((f) => f === filePath) ||
            (this.fileSystemUtility.isDirectory(filePath) && !filePath.endsWith(".app"))
        );
    }

    public async extractFileIcon(filePath: string) {
        const assetFileName = Object.keys(this.folderPaths).includes(filePath)
            ? this.folderPaths[filePath]
            : "GenericFolderIcon.png";

        return {
            url: `file://${this.assetPathResolver.getModuleAssetPath("FileImageGenerator", join("macOS", assetFileName))}`,
        };
    }

    public async extractFileIcons(filePaths: string[]) {
        const result: Record<string, Image> = {};

        for (const filePath of filePaths) {
            result[filePath] = await this.extractFileIcon(filePath);
        }

        return result;
    }
}
