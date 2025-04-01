import type { AssetPathResolver } from "@Core/AssetPathResolver";
import type { Extension } from "@Core/Extension";
import type { FileSystemUtility } from "@Core/FileSystemUtility";
import type { Logger } from "@Core/Logger";
import type { SettingsManager } from "@Core/SettingsManager";
import type { Translator } from "@Core/Translator";
import {
    createInvokeExtensionAction,
    createOpenFileAction,
    type OperatingSystem,
    type SearchResultItem,
} from "@common/Core";
import { getExtensionSettingKey } from "@common/Core/Extension";
import type { Image } from "@common/Core/Image";
import type { App } from "electron";
import { basename, dirname } from "path";
import type { FileSearcher } from "./FileSearcher";
import type { Settings } from "./Settings";

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

    private readonly defaultSettings: Settings = {
        maxSearchResultCount: 20,
        everythingCliFilePath: "",
    };

    public constructor(
        private readonly operatingSystem: OperatingSystem,
        private readonly assetPathResolver: AssetPathResolver,
        private readonly fileSystemUtility: FileSystemUtility,
        private readonly settingsManager: SettingsManager,
        private readonly app: App,
        private readonly logger: Logger,
        private readonly translator: Translator,
        private readonly fileSearcher: FileSearcher,
    ) {}

    public async getSearchResultItems(): Promise<SearchResultItem[]> {
        const { t } = this.translator.createT(this.getI18nResources());

        return [
            {
                defaultAction: createInvokeExtensionAction({
                    extensionId: this.id,
                    description: "Search files",
                }),
                description: t("extensionName"),
                id: "file-search:invoke",
                image: this.getImage(),
                name: t("searchResultItemName"),
            },
        ];
    }

    public isSupported(): boolean {
        return this.operatingSystem == "macOS" || this.operatingSystem === "Windows";
    }

    public getSettingDefaultValue(key: keyof Settings) {
        return this.defaultSettings[key];
    }

    public getImage(): Image {
        const fileNames: Record<OperatingSystem, string> = {
            Linux: "", // Currently not supported,
            macOS: "macos-folder-icon.png",
            Windows: "macos-folder-icon.png",
        };

        return {
            url: `file://${this.assetPathResolver.getExtensionAssetPath(this.id, fileNames[this.operatingSystem])}`,
        };
    }

    public getI18nResources() {
        return {
            "en-US": {
                extensionName: "File Search",
                esFilePath: "Everything CLI file path",
                fileDoesNotExist: "File does not exist",
                maxSearchResults: "Max search results",
                searchResultItemName: "Search files",
            },
            "de-CH": {
                extensionName: "Dateisuche",
                esFilePath: "Everything CLI-Dateipfad",
                fileDoesNotExist: "File does not exist",
                maxSearchResults: "Maximale Suchergebnisse",
                searchResultItemName: "Dateien suchen",
            },
            "ja-JP": {
                extensionName: "ファイル検索",
                esFilePath: "すべてCLIのファイルパスにする",
                fileDoesNotExist: "ファイルが見付かりません",
                maxSearchResults: "検索上限数",
                searchResultItemName: "ファイル検索 | Search files",
            },
        };
    }

    public getSettingKeysTriggeringRescan?(): string[] {
        return ["general.settings"];
    }

    public async invoke({ searchTerm }: { searchTerm: string }): Promise<SearchResultItem[]> {
        const filePaths = await this.fileSearcher.getFilePathsBySearchTerm(searchTerm, this.getMaxSearchResultCount());
        const filePathIconMap = await this.getFileIconMap(filePaths);

        return filePaths.map((filePath) => {
            const isDirectory =
                this.fileSystemUtility.isAccessibleSync(filePath) && this.fileSystemUtility.isDirectory(filePath);

            return {
                defaultAction: createOpenFileAction({
                    filePath,
                    description: `Open ${isDirectory ? "Folder" : "File"}`,
                }),
                description: isDirectory ? "Folder" : "File",
                details: dirname(filePath),
                dragAndDrop: { filePath },
                id: `file-search-result:${Buffer.from(filePath).toString("base64")}`,
                image: { url: filePathIconMap[filePath] },
                name: basename(filePath),
            };
        });
    }

    private getMaxSearchResultCount(): number {
        return this.settingsManager.getValue(
            getExtensionSettingKey(this.id, "maxSearchResultCount"),
            this.defaultSettings.maxSearchResultCount,
        );
    }

    private async getFileIconMap(filePaths: string[]): Promise<Record<string, string>> {
        const result: Record<string, string> = {};
        const promiseResults = await Promise.allSettled(filePaths.map((filePath) => this.app.getFileIcon(filePath)));

        for (let i = 0; i < promiseResults.length; i++) {
            const promiseResult = promiseResults[i];

            if (promiseResult.status === "fulfilled") {
                result[filePaths[i]] = promiseResult.value.toDataURL();
            } else if (promiseResult.status === "rejected") {
                this.logger.error(
                    `Failed to generate icon for file path "${filePaths[i]}". Reason: ${promiseResult.reason}`,
                );
            }
        }

        return result;
    }
}
