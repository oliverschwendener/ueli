import type { AssetPathResolver } from "@Core/AssetPathResolver";
import { CommandlineUtility } from "@Core/CommandlineUtility";
import type { Extension } from "@Core/Extension";
import { SettingsManager } from "@Core/SettingsManager";
import { SearchResultItemActionUtility, type OperatingSystem, type SearchResultItem } from "@common/Core";
import { getExtensionSettingKey, type Translations } from "@common/Core/Extension";
import type { Image } from "@common/Core/Image";
import { statSync } from "fs";
import { basename } from "path";

export class FileSearch implements Extension {
    public readonly id = "FileSearch";
    public readonly name = "File Search";

    public readonly nameTranslation = {
        key: "extensionName",
        namespace: "extension[FileSearch]",
    };

    public readonly author = {
        name: "Oliver Schwendener",
        githubUserName: "oliverschwendener",
    };

    private readonly defaultSettings = {
        maxSearchResultCount: 20,
    };

    public constructor(
        private readonly operatingSystem: OperatingSystem,
        private readonly assetPathResolver: AssetPathResolver,
        private readonly commandlineUtility: CommandlineUtility,
        private readonly settingsManager: SettingsManager,
    ) {}

    public async getSearchResultItems(): Promise<SearchResultItem[]> {
        return [
            {
                defaultAction: SearchResultItemActionUtility.createInvokeExtensionAction({
                    extensionId: this.id,
                    description: "Search files",
                }),
                description: "File Search",
                id: "file-search:invoke",
                image: this.getImage(),
                name: "Search files",
            },
        ]; // TODO
    }

    public isSupported(): boolean {
        return this.operatingSystem === "macOS";
    }

    public getSettingDefaultValue<T>(key: string): T {
        return this.defaultSettings[key] as T;
    }

    public getImage(): Image {
        return {
            url: `file://${this.assetPathResolver.getExtensionAssetPath(this.id, "macos-folder-icon.png")}`,
        };
    }

    public getTranslations(): Translations {
        return {
            "en-US": {
                extensionName: "File Search",
            },
            "de-CH": {
                extensionName: "Dateisuche",
            },
        };
    }

    public getSettingKeysTriggeringRescan?(): string[] {
        return ["general.settings"];
    }

    public async invoke({ searchTerm }: { searchTerm: string }): Promise<SearchResultItem[]> {
        const filePaths = await this.getFilePathsBySearchTerm(searchTerm);

        return filePaths.map((filePath) => {
            const isDirectory = statSync(filePath).isDirectory();

            return {
                defaultAction: SearchResultItemActionUtility.createOpenFileAction({
                    filePath,
                    description: `Open ${isDirectory ? "Folder" : "File"}`,
                }),
                description: isDirectory ? "Folder" : "File",
                id: `file-search-result:${Buffer.from(filePath).toString("base64")}`,
                image: this.getImage(),
                name: basename(filePath),
            };
        });
    }

    private async getFilePathsBySearchTerm(searchTerm: string): Promise<string[]> {
        const maxSearchResultCount = this.getMaxSearchResultCount();

        const stdout = await this.commandlineUtility.executeCommandWithOutput(
            `mdfind -name "${searchTerm}" -onlyin "/Users/oliverschwendener" | head -n ${maxSearchResultCount}`,
            true,
        );

        return stdout.split("\n").filter((filePath) => filePath.trim().length > 0);
    }

    private getMaxSearchResultCount(): number {
        return this.settingsManager.getValue(
            getExtensionSettingKey(this.id, "maxSearchResultCount"),
            this.defaultSettings.maxSearchResultCount,
        );
    }
}
