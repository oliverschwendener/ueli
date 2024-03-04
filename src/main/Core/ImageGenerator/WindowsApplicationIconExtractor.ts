import type { FileSystemUtility } from "@Core/FileSystemUtility";
import type { PowershellUtility } from "@Core/PowershellUtility";
import { join } from "path";
import type { CacheFileNameGenerator } from "./CacheFileNameGenerator";
import type { FileIconExtractor } from "./FileIconExtractor";
import { extractAssociatedFileIconPowershellScript } from "./powershellScripts";

export class WindowsApplicationIconExtractor implements FileIconExtractor {
    public constructor(
        private readonly fileSystemUtility: FileSystemUtility,
        private readonly powershellUtility: PowershellUtility,
        private readonly cacheFileNameGenerator: CacheFileNameGenerator,
        private readonly cacheFolderPath: string,
    ) {}

    public machtes(filePath: string) {
        return (
            filePath.endsWith(".lnk") ||
            filePath.endsWith(".url") ||
            filePath.endsWith(".appref-ms") ||
            filePath.endsWith(".exe")
        );
    }

    public async extractFileIcon(filePath: string) {
        const cachedFilePath = await this.ensureCachedFileExists(filePath);
        return { url: `file://${cachedFilePath}` };
    }

    private async ensureCachedFileExists(filePath: string): Promise<string> {
        const outFilePath = join(
            this.cacheFolderPath,
            `${this.cacheFileNameGenerator.generateCacheFileName(filePath)}.png`,
        );

        const cachedFileAlreadyExists = await this.fileSystemUtility.pathExists(outFilePath);

        if (!cachedFileAlreadyExists) {
            await this.powershellUtility.executeScript(`
                ${extractAssociatedFileIconPowershellScript}
                Get-Associated-Icon -InFilePath "${filePath}" -OutFilePath "${outFilePath}"
            `);
        }

        return outFilePath;
    }
}
