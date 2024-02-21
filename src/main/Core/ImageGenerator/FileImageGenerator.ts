import type { ExtensionCacheFolder } from "@Core/ExtensionCacheFolder";
import type { FileSystemUtility } from "@Core/FileSystemUtility";
import type { Image } from "@common/Core/Image";
import { createHash } from "crypto";
import getFileIcon from "extract-file-icon";
import { join } from "path";
import type { FileImageGenerator as FileImageGeneratorInterface } from "./Contract";

export class FileImageGenerator implements FileImageGeneratorInterface {
    public constructor(
        private readonly extensionCacheFolder: ExtensionCacheFolder,
        private readonly fileSystemUtility: FileSystemUtility,
    ) {}

    public async getImage(filePath: string): Promise<Image> {
        const cachedPngFilePath = await this.ensureCachedPngFileExists(filePath);

        return { url: `file://${cachedPngFilePath}` };
    }

    private async ensureCachedPngFileExists(filePath: string): Promise<string> {
        const cachedPngFilePath = join(this.extensionCacheFolder.path, `${this.generateCacheFileName(filePath)}.png`);

        const exists = await this.fileSystemUtility.pathExists(cachedPngFilePath);

        if (!exists) {
            await this.fileSystemUtility.writePng(getFileIcon(filePath), cachedPngFilePath);
        }

        return cachedPngFilePath;
    }

    private generateCacheFileName(filePath: string): string {
        return createHash("sha1").update(filePath).digest("hex");
    }
}
