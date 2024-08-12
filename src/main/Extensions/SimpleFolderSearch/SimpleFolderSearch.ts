import { OperatingSystem, SearchResultItem, SearchResultItemActionUtility } from "@common/Core";
import { getExtensionSettingKey } from "@common/Core/Extension";
import { Image } from "@common/Core/Image";
import { Resources, Translations } from "@common/Core/Translator";
import { AssetPathResolver } from "@Core/AssetPathResolver";
import { Extension } from "@Core/Extension";
import { FileSystemUtility } from "@Core/FileSystemUtility";
import { SettingsManager } from "@Core/SettingsManager";
import { Translator } from "@Core/Translator";
import { App } from "electron";
import path from "path";

export class SimpleFolderSearch implements Extension {
    public readonly id = "SimpleFolderSearch";
    public readonly name = "Simple Folder Search";

    public readonly author = {
        name: "Sasha Weiss",
        githubUserName: "sashaweiss",
    };

    private readonly defaultSettings: Record<OperatingSystem, { folders: string[] }> = {
        Windows: {
            folders: [this.app.getPath("home")],
        },
        macOS: {
            folders: [this.app.getPath("home")],
        },
        Linux: {
            folders: [this.app.getPath("home")],
        },
    };

    private readonly folderIconImage: Image = {
        url: `file://${this.assetPathResolver.getExtensionAssetPath(this.id, "macos-folder-icon.png")}`,
    };

    public constructor(
        private readonly app: App,
        private readonly operatingSystem: OperatingSystem,
        private readonly assetPathResolver: AssetPathResolver,
        private readonly fileSystemUtility: FileSystemUtility,
        private readonly settingsManager: SettingsManager,
        private readonly translator: Translator,
    ) {}

    public async getSearchResultItems(): Promise<SearchResultItem[]> {
        type SearchResult = {
            fullPath: string;
            abbreviatedName: string;
            fileName: string;
        };

        const searchResultBatches: SearchResult[][] = await Promise.all(
            this.getPathsToSearch().map(async (folderPath: string): Promise<SearchResult[]> => {
                const directoryEntries = await this.fileSystemUtility.readDirectory(folderPath);
                return directoryEntries.map((directoryEntry): SearchResult => {
                    return {
                        fullPath: directoryEntry,
                        abbreviatedName: directoryEntry.replace(this.app.getPath("home"), "~"),
                        fileName: path.parse(directoryEntry).base,
                    };
                });
            }),
        );

        const searchResults: SearchResult[] = searchResultBatches.reduce(
            (accumulator: SearchResult[], nextValue: SearchResult[]): SearchResult[] => {
                return accumulator.concat(nextValue);
            },
            [],
        );

        // Filter out non-directories, and hidden items.
        const filteredSearchResults: SearchResult[] = searchResults.filter((searchResult: SearchResult): boolean => {
            return this.fileSystemUtility.isDirectory(searchResult.fullPath) && !searchResult.fileName.startsWith(".");
        });

        return filteredSearchResults.map((searchResult: SearchResult): SearchResultItem => {
            return {
                id: `${this.id}-path-${searchResult.fullPath}`, // Ensure unique
                name: searchResult.fileName,
                description: `Open ${searchResult.abbreviatedName}`,
                image: this.folderIconImage,
                defaultAction: SearchResultItemActionUtility.createOpenFileAction({
                    filePath: searchResult.fullPath,
                    description: `Open ${searchResult.abbreviatedName}`,
                }),
            };
        });
    }

    public isSupported(): boolean {
        return this.operatingSystem == "macOS";
    }

    public getSettingDefaultValue<T>(key: string): T {
        return this.defaultSettings[this.operatingSystem][key] as T;
    }

    public getSettingKeysTriggeringRescan(): string[] {
        return [getExtensionSettingKey(this.id, "folders")];
    }

    private getPathsToSearch(): string[] {
        const defaultFolders = this.defaultSettings[this.operatingSystem].folders;
        return this.settingsManager.getValue(getExtensionSettingKey(this.id, "folders"), defaultFolders);
    }

    public getImage(): Image {
        return this.folderIconImage;
    }

    public getI18nResources(): Resources<Translations> {
        return {
            "en-US": {
                extensionName: "Simple Folder Search",
            },
        };
    }
}
