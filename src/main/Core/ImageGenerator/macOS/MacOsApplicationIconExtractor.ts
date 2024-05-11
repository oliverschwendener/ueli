import type { CommandlineUtility } from "@Core/CommandlineUtility";
import type { FileSystemUtility } from "@Core/FileSystemUtility";
import type { Image } from "@common/Core/Image";
import { join } from "path";
import type { CacheFileNameGenerator } from "../CacheFileNameGenerator";
import type { FileIconExtractor } from "../FileIconExtractor";

export class MacOsApplicationIconExtractor implements FileIconExtractor {
    public constructor(
        private readonly fileSystemUtility: FileSystemUtility,
        private readonly commandlineUtility: CommandlineUtility,
        private readonly cacheFileNameGenerator: CacheFileNameGenerator,
        private readonly cacheFolder: string,
    ) {}

    public matchesFilePath(filePath: string) {
        return filePath.endsWith(".app");
    }

    public async extractFileIcon(applicationFilePath: string): Promise<Image> {
        const iconFilePath = await this.ensureCachedIconExists(applicationFilePath);
        return { url: `file://${iconFilePath}` };
    }

    public async extractFileIcons(filePaths: string[]) {
        const result: Record<string, Image> = {};

        const promiseResults = await Promise.allSettled(filePaths.map((filePath) => this.extractFileIcon(filePath)));

        for (let i = 0; i < filePaths.length; i++) {
            const filePath = filePaths[i];
            const promiseResult = promiseResults[i];

            if (promiseResult.status === "fulfilled") {
                result[filePath] = promiseResult.value;
            }
        }

        return result;
    }

    private async ensureCachedIconExists(applicationFilePath: string): Promise<string> {
        const iconFilePath = this.getIconFilePath(applicationFilePath);

        const iconFileAlreadyExists = await this.fileSystemUtility.pathExists(iconFilePath);

        if (!iconFileAlreadyExists) {
            await this.generateAppIcon(applicationFilePath, iconFilePath);
        }

        return iconFilePath;
    }

    private async generateAppIcon(applicationFilePath: string, iconFilePath: string): Promise<void> {
        const icnsIconFilePath = await this.getIcnsIconFilePath(applicationFilePath);

        await this.commandlineUtility.executeCommand(`sips -s format png "${icnsIconFilePath}" -o "${iconFilePath}"`);
    }

    private getIconFilePath(applicationFilePath: string): string {
        return `${join(this.cacheFolder, this.cacheFileNameGenerator.generateCacheFileName(applicationFilePath))}.png`;
    }

    private async getIcnsIconFilePath(applicationFilePath: string): Promise<string> {
        const infoPlistFilePath = join(applicationFilePath, "Contents", "Info.plist");

        const relativeIcnsFilePath = await this.commandlineUtility.executeCommand(
            `defaults read "${infoPlistFilePath}" CFBundleIconFile`,
        );

        const potentialIcnsFilePath = join(applicationFilePath, "Contents", "Resources", relativeIcnsFilePath.trim());

        return potentialIcnsFilePath.endsWith(".icns") ? potentialIcnsFilePath : `${potentialIcnsFilePath}.icns`;
    }
}
