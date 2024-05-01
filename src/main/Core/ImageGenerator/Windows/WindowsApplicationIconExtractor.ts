import type { FileSystemUtility } from "@Core/FileSystemUtility";
import type { PowershellUtility } from "@Core/PowershellUtility";
import type { Image } from "@common/Core/Image";
import { join } from "path";
import type { CacheFileNameGenerator } from "../CacheFileNameGenerator";
import type { FileIconExtractor } from "../FileIconExtractor";
import { extractAssociatedFileIconPowershellScript } from "./powershellScripts";

export class WindowsApplicationIconExtractor implements FileIconExtractor {
    public constructor(
        private readonly fileSystemUtility: FileSystemUtility,
        private readonly powershellUtility: PowershellUtility,
        private readonly cacheFileNameGenerator: CacheFileNameGenerator,
        private readonly cacheFolderPath: string,
    ) {}

    public matchesFilePath(filePath: string) {
        return (
            filePath.endsWith(".lnk") ||
            filePath.endsWith(".url") ||
            filePath.endsWith(".appref-ms") ||
            filePath.endsWith(".exe")
        );
    }

    public async extractFileIcon(filePath: string) {
        const cacheFilePath = await this.ensureCachedFileExists(filePath);
        return { url: `file://${cacheFilePath}` };
    }

    public async extractFileIcons(filePaths: string[]) {
        const result: Record<string, Image> = {};
        const cacheFilePaths = this.getCacheFilePaths(filePaths);

        const filePathsToEnsure = await this.filterAlreadyExistingFilePaths(filePaths);

        if (filePathsToEnsure.length) {
            await this.powershellUtility.executeScript(`
                ${extractAssociatedFileIconPowershellScript}
                ${filePathsToEnsure.map((f) => this.getPowershellCommand(f, cacheFilePaths[f])).join("\n")}
            `);
        }

        for (const filePath of filePaths) {
            result[filePath] = {
                url: `file://${cacheFilePaths[filePath]}`,
            };
        }

        return result;
    }

    private async filterAlreadyExistingFilePaths(filePaths: string[]): Promise<string[]> {
        const result: string[] = [];

        const promiseResults = await Promise.allSettled(
            filePaths.map((f) => this.fileSystemUtility.pathExists(this.getCacheFilePath(f))),
        );

        for (let i = 0; i < filePaths.length; i++) {
            const filePath = filePaths[i];
            const promiseResult = promiseResults[i];

            if (promiseResult.status === "fulfilled") {
                if (!promiseResult.value) {
                    result.push(filePath);
                }
            }
        }

        return result;
    }

    private async ensureCachedFileExists(filePath: string): Promise<string> {
        const cacheFilePath = this.getCacheFilePath(filePath);
        const cachedFileAlreadyExists = await this.fileSystemUtility.pathExists(cacheFilePath);

        if (!cachedFileAlreadyExists) {
            await this.powershellUtility.executeScript(`
                ${extractAssociatedFileIconPowershellScript}
                ${this.getPowershellCommand(filePath, cacheFilePath)}
            `);
        }

        return cacheFilePath;
    }

    private getPowershellCommand(inFilePath: string, outFilePath: string): string {
        return `Get-Associated-Icon -InFilePath "${inFilePath}" -OutFilePath "${outFilePath}"`;
    }

    private getCacheFilePaths(filePaths: string[]): Record<string, string> {
        const result: Record<string, string> = {};

        for (const filePath of filePaths) {
            result[filePath] = this.getCacheFilePath(filePath);
        }

        return result;
    }

    private getCacheFilePath(filePath: string): string {
        return join(this.cacheFolderPath, `${this.cacheFileNameGenerator.generateCacheFileName(filePath)}.png`);
    }
}
