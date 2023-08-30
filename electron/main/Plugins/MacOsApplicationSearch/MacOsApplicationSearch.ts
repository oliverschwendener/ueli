import { join, normalize } from "path";
import type { SearchIndex } from "../../SearchIndex";
import type { SettingsManager } from "../../Settings/SettingsManager";
import { CommandlineUtility, FileSystemUtility } from "../../Utilities";
import type { Plugin } from "../Plugin";
import type { PluginDependencies } from "../PluginDependencies";
import { Application } from "./Application";
import type { Settings } from "./Settings";

export class MacOsApplicationSearch implements Plugin {
    private static readonly PluginId = "MacOsApplicationSearch";

    private readonly commandlineUtility: CommandlineUtility;
    private readonly defaultSettings: Settings;
    private readonly fileSystemUtility: FileSystemUtility;
    private readonly pluginCacheFolderPath: string;
    private readonly searchIndex: SearchIndex;
    private readonly settingsManager: SettingsManager;

    public constructor({
        app,
        commandlineUtility,
        fileSystemUtility,
        pluginCacheFolderPath,
        searchIndex,
        settingsManager,
    }: PluginDependencies) {
        this.commandlineUtility = commandlineUtility;
        this.fileSystemUtility = fileSystemUtility;
        this.pluginCacheFolderPath = pluginCacheFolderPath;
        this.searchIndex = searchIndex;
        this.settingsManager = settingsManager;

        this.defaultSettings = {
            folders: ["/System/Applications", "/Applications", join(app.getPath("home"), "Applications")],
        };
    }

    public async addSearchResultItemsToSearchIndex(): Promise<void> {
        const filePaths = await this.getAllFilePaths();
        const icons = await this.getAllIcons(filePaths);

        this.searchIndex.addSearchResultItems(
            MacOsApplicationSearch.PluginId,
            filePaths
                .map((filePath) => Application.fromFilePathAndOptionalIcon({ filePath, iconFilePath: icons[filePath] }))
                .map((application) => application.toSearchResultItem()),
        );
    }

    private async getAllFilePaths(): Promise<string[]> {
        return (await this.commandlineUtility.executeCommandWithOutput(`mdfind "kMDItemKind == 'Application'"`))
            .split("\n")
            .map((filePath) => normalize(filePath).trim())
            .filter((filePath) =>
                this.settingsManager
                    .getPluginSettingByKey<string[]>(
                        MacOsApplicationSearch.PluginId,
                        "folders",
                        this.defaultSettings.folders,
                    )
                    .some((applicationFolder) => filePath.startsWith(applicationFolder)),
            )
            .filter((filePath) => [".", ".."].indexOf(filePath) === -1);
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
        const iconFilePath = `${join(
            this.pluginCacheFolderPath,
            Buffer.from(applicationFilePath).toString("base64"),
        )}.png`;

        if (await this.fileSystemUtility.pathExists(iconFilePath)) {
            return { applicationFilePath, iconFilePath };
        }

        const relativeIcnsFilePath = (
            await this.commandlineUtility.executeCommandWithOutput(
                `defaults read "${join(applicationFilePath, "Contents", "Info.plist")}" CFBundleIconFile`,
            )
        ).trim();

        const potentialIcnsFilePath = join(applicationFilePath, "Contents", "Resources", relativeIcnsFilePath);

        const icnsIconFilePath = potentialIcnsFilePath.endsWith(".icns")
            ? potentialIcnsFilePath
            : `${potentialIcnsFilePath}.icns`;

        await this.commandlineUtility.executeCommand(`sips -s format png "${icnsIconFilePath}" -o "${iconFilePath}"`);

        return { applicationFilePath, iconFilePath };
    }
}
