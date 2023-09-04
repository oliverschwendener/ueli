import type { OperatingSystem } from "@common/OperatingSystem";
import { join, normalize } from "path";
import type { Plugin } from "../Plugin";
import type { PluginDependencies } from "../PluginDependencies";
import { Application } from "./Application";

export class MacOsApplicationSearch implements Plugin {
    private static readonly PluginId = "MacOsApplicationSearch";

    public constructor(private readonly pluginDependencies: PluginDependencies) {}

    public getSupportedOperatingSystems(): OperatingSystem[] {
        return ["macOS"];
    }

    public async addSearchResultItemsToSearchIndex(): Promise<void> {
        const { searchIndex } = this.pluginDependencies;

        const filePaths = await this.getAllFilePaths();
        const icons = await this.getAllIcons(filePaths);

        searchIndex.addSearchResultItems(
            MacOsApplicationSearch.PluginId,
            filePaths
                .map((filePath) => Application.fromFilePathAndOptionalIcon({ filePath, iconFilePath: icons[filePath] }))
                .map((application) => application.toSearchResultItem()),
        );
    }

    private async getAllFilePaths(): Promise<string[]> {
        const { commandlineUtility, settingsManager } = this.pluginDependencies;

        return (await commandlineUtility.executeCommandWithOutput(`mdfind "kMDItemKind == 'Application'"`))
            .split("\n")
            .map((filePath) => normalize(filePath).trim())
            .filter((filePath) =>
                settingsManager
                    .getPluginSettingByKey<string[]>(
                        MacOsApplicationSearch.PluginId,
                        "folders",
                        this.getDefaultFolders(),
                    )
                    .some((folderPath) => filePath.startsWith(folderPath)),
            )
            .filter((filePath) => ![".", ".."].includes(filePath));
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
