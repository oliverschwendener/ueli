import { join, normalize, parse } from "path";
import type { PluginDependencies } from "../PluginDependencies";
import { Application } from "./Application";
import type { ApplicationRepository } from "./ApplicationRepository";

export class MacOsApplicationRepository implements ApplicationRepository {
    public constructor(
        private readonly pluginDependencies: PluginDependencies,
        private readonly pluginId: string,
    ) {}

    public async getApplications(): Promise<Application[]> {
        const filePaths = await this.getAllFilePaths();
        const icons = await this.getAllIcons(filePaths);

        return filePaths.map((filePath) => new Application(parse(filePath).base, filePath, icons[filePath]));
    }

    private async getAllFilePaths(): Promise<string[]> {
        const { commandlineUtility } = this.pluginDependencies;

        return (await commandlineUtility.executeCommandWithOutput(`mdfind "kMDItemKind == 'Application'"`))
            .split("\n")
            .map((filePath) => normalize(filePath).trim())
            .filter((filePath) => this.filterFilePathByConfiguredFolders(filePath))
            .filter((filePath) => ![".", ".."].includes(filePath));
    }

    private filterFilePathByConfiguredFolders(filePath: string): boolean {
        const { settingsManager } = this.pluginDependencies;

        return settingsManager
            .getPluginSettingByKey<string[]>(this.pluginId, "folders", this.getDefaultFolders())
            .some((folderPath) => filePath.startsWith(folderPath));
    }

    private async getAllIcons(filePaths: string[]): Promise<Record<string, string>> {
        const result: Record<string, string> = {};

        const promiseResults = await Promise.allSettled(filePaths.map((filePath) => this.generateMacAppIcon(filePath)));

        for (const promiseResult of promiseResults) {
            if (promiseResult.status === "fulfilled") {
                result[promiseResult.value.applicationFilePath] = promiseResult.value.iconFilePath;
            }
        }

        return result;
    }

    private async generateMacAppIcon(
        applicationFilePath: string,
    ): Promise<{ applicationFilePath: string; iconFilePath: string }> {
        const { commandlineUtility, fileSystemUtility, pluginCacheFolderPath } = this.pluginDependencies;

        const iconFilePath = `${join(pluginCacheFolderPath, Buffer.from(applicationFilePath).toString("base64"))}.png`;

        if (await fileSystemUtility.pathExists(iconFilePath)) {
            return { applicationFilePath, iconFilePath };
        }

        const relativeIcnsFilePath = await commandlineUtility.executeCommandWithOutput(
            `defaults read "${join(applicationFilePath, "Contents", "Info.plist")}" CFBundleIconFile`,
        );

        const potentialIcnsFilePath = join(applicationFilePath, "Contents", "Resources", relativeIcnsFilePath.trim());

        const icnsIconFilePath = potentialIcnsFilePath.endsWith(".icns")
            ? potentialIcnsFilePath
            : `${potentialIcnsFilePath}.icns`;

        await commandlineUtility.executeCommand(`sips -s format png "${icnsIconFilePath}" -o "${iconFilePath}"`);

        return { applicationFilePath, iconFilePath };
    }

    private getDefaultFolders(): string[] {
        const { app } = this.pluginDependencies;

        return ["/System/Applications", "/Applications", join(app.getPath("home"), "Applications")];
    }
}
