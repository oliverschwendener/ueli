import { join } from "path";
import type { PluginDependencies } from "../../PluginDependencies";

export class MacOsApplicationIconGenerator {
    public constructor(private readonly pluginDependencies: PluginDependencies) {}

    public async generateApplicationIcon(
        applicationFilePath: string,
    ): Promise<{ applicationFilePath: string; iconFilePath: string }> {
        const { fileSystemUtility, commandlineUtility } = this.pluginDependencies;

        const iconFilePath = this.getIconFilePath(applicationFilePath);

        if (await fileSystemUtility.pathExists(iconFilePath)) {
            return { applicationFilePath, iconFilePath };
        }

        const icnsIconFilePath = await this.getIcnsIconFilePath(applicationFilePath);

        await commandlineUtility.executeCommand(`sips -s format png "${icnsIconFilePath}" -o "${iconFilePath}"`);

        return { applicationFilePath, iconFilePath };
    }

    private getIconFilePath(applicationFilePath: string): string {
        const { pluginCacheFolderPath } = this.pluginDependencies;

        return `${join(pluginCacheFolderPath, Buffer.from(applicationFilePath).toString("base64"))}.png`;
    }

    private async getIcnsIconFilePath(applicationFilePath: string): Promise<string> {
        const { commandlineUtility } = this.pluginDependencies;

        const infoPlistFilePath = join(applicationFilePath, "Contents", "Info.plist");

        const relativeIcnsFilePath = await commandlineUtility.executeCommandWithOutput(
            `defaults read "${infoPlistFilePath}" CFBundleIconFile`,
        );

        const potentialIcnsFilePath = join(applicationFilePath, "Contents", "Resources", relativeIcnsFilePath.trim());

        return potentialIcnsFilePath.endsWith(".icns") ? potentialIcnsFilePath : `${potentialIcnsFilePath}.icns`;
    }
}
