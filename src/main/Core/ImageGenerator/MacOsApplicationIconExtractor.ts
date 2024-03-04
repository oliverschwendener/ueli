import type { CommandlineUtility } from "@Core/CommandlineUtility";
import type { FileSystemUtility } from "@Core/FileSystemUtility";
import type { Image } from "@common/Core/Image";
import { join } from "path";
import type { CacheFileNameGenerator } from "./CacheFileNameGenerator";
import type { FileIconExtractor } from "./FileIconExtractor";

export class MacOsApplicationIconExtractor implements FileIconExtractor {
    public constructor(
        private readonly fileSystemUtility: FileSystemUtility,
        private readonly commandlineUtility: CommandlineUtility,
        private readonly cacheFolder: string,
        private readonly cacheFileNameGenerator: CacheFileNameGenerator,
    ) {}

    public machtes(filePath: string) {
        return filePath.endsWith(".app");
    }

    public async extractFileIcon(applicationFilePath: string): Promise<Image> {
        const iconFilePath = await this.ensureCachedIconExists(applicationFilePath);
        return { url: `file://${iconFilePath}` };
    }

    private async ensureCachedIconExists(applicationFilePath: string): Promise<string> {
        const iconFilePath = this.getIconFilePath(applicationFilePath);

        if (await this.fileSystemUtility.pathExists(iconFilePath)) {
            return iconFilePath;
        }

        const icnsIconFilePath = await this.getIcnsIconFilePath(applicationFilePath);

        await this.commandlineUtility.executeCommand(`sips -s format png "${icnsIconFilePath}" -o "${iconFilePath}"`);

        return iconFilePath;
    }

    private getIconFilePath(applicationFilePath: string): string {
        return `${join(this.cacheFolder, this.cacheFileNameGenerator.generateCacheFileName(applicationFilePath))}.png`;
    }

    private async getIcnsIconFilePath(applicationFilePath: string): Promise<string> {
        const infoPlistFilePath = join(applicationFilePath, "Contents", "Info.plist");

        const relativeIcnsFilePath = await this.commandlineUtility.executeCommandWithOutput(
            `defaults read "${infoPlistFilePath}" CFBundleIconFile`,
        );

        const potentialIcnsFilePath = join(applicationFilePath, "Contents", "Resources", relativeIcnsFilePath.trim());

        return potentialIcnsFilePath.endsWith(".icns") ? potentialIcnsFilePath : `${potentialIcnsFilePath}.icns`;
    }
}
