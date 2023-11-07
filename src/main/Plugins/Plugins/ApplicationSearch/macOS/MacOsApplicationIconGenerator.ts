import type { CommandlineUtility } from "@common/CommandlineUtility";
import type { FileSystemUtility } from "@common/FileSystemUtility";
import type { PluginCacheFolder } from "@common/PluginCacheFolder";
import { join } from "path";

export class MacOsApplicationIconGenerator {
    public constructor(
        private readonly fileSystemUtility: FileSystemUtility,
        private readonly commandlineUtility: CommandlineUtility,
        private readonly pluginCacheFolder: PluginCacheFolder,
    ) {}

    public async generateApplicationIcon(
        applicationFilePath: string,
    ): Promise<{ applicationFilePath: string; iconFilePath: string }> {
        const iconFilePath = this.getIconFilePath(applicationFilePath);

        if (await this.fileSystemUtility.pathExists(iconFilePath)) {
            return { applicationFilePath, iconFilePath };
        }

        const icnsIconFilePath = await this.getIcnsIconFilePath(applicationFilePath);

        await this.commandlineUtility.executeCommand(`sips -s format png "${icnsIconFilePath}" -o "${iconFilePath}"`);

        return { applicationFilePath, iconFilePath };
    }

    private getIconFilePath(applicationFilePath: string): string {
        return `${join(this.pluginCacheFolder.path, Buffer.from(applicationFilePath).toString("base64"))}.png`;
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
