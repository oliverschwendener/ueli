import type { OperatingSystem } from "@common/Core";
import { SearchResultItemActionUtility, type SearchResultItem } from "@common/Core";
import { getExtensionSettingKey } from "@common/Core/Extension";
import type { Image } from "@common/Core/Image";
import type { Resources, Translations } from "@common/Core/Translator";
import type { Settings } from "@common/Extensions/SimpleFileSearch";
import type { AssetPathResolver } from "@Core/AssetPathResolver";
import type { Extension } from "@Core/Extension";
import type { FileSystemUtility } from "@Core/FileSystemUtility";
import type { FileImageGenerator } from "@Core/ImageGenerator";
import type { Logger } from "@Core/Logger";
import type { SettingsManager } from "@Core/SettingsManager";
import type { Translator } from "@Core/Translator";
import type { App } from "electron";
import { basename } from "path";

export class SimpleFileSearchExtension implements Extension {
    public readonly id = "SimpleFileSearch";

    public readonly name = "Simple File Search";

    public readonly nameTranslation = {
        key: "extensionName",
        namespace: "extension[SimpleFileSearch]",
    };

    public readonly author = {
        name: "Oliver Schwendener",
        githubUserName: "oliverschwendener",
    };

    public constructor(
        private readonly fileSystemUtility: FileSystemUtility,
        private readonly fileImageGenerator: FileImageGenerator,
        private readonly logger: Logger,
        private readonly assetPathResolver: AssetPathResolver,
        private readonly operatingSystem: OperatingSystem,
        private readonly settingsManager: SettingsManager,
        private readonly app: App,
        private readonly translator: Translator,
    ) {}

    public async getSearchResultItems(): Promise<SearchResultItem[]> {
        const filePaths = await this.getFilePaths();
        const types = await this.getTypes(filePaths);
        const images = await this.fileImageGenerator.getImages(filePaths);

        const { t } = this.translator.createT(this.getI18nResources());

        return filePaths.map(
            (filePath): SearchResultItem => ({
                id: `simple-file-search-${filePath}`,
                name: basename(filePath),
                description: types[filePath] === "folder" ? t("folder") : t("file"),
                image: images[filePath] ?? this.getImage(),
                defaultAction: SearchResultItemActionUtility.createOpenFileAction({
                    filePath,
                    description: types[filePath] === "folder" ? t("openFolder") : t("openFile"),
                }),
                additionalActions: [SearchResultItemActionUtility.createShowItemInFileExplorerAction({ filePath })],
            }),
        );
    }

    private async getTypes(filePaths: string[]): Promise<Record<string, "folder" | "file">> {
        const promiseResults = await Promise.allSettled(
            filePaths.map((filePath) => this.fileSystemUtility.isDirectory(filePath)),
        );

        const result: Record<string, "folder" | "file"> = {};

        for (let i = 0; i < filePaths.length; i++) {
            const promiseResult = promiseResults[i];
            const filePath = filePaths[i];

            if (promiseResult.status === "fulfilled") {
                result[filePath] = promiseResult.value ? "folder" : "file";
            } else {
                this.logger.error(`Unable to determine if file path is directory. Reason: ${promiseResult.reason}`);
            }
        }

        return result;
    }

    private async getFilePaths(): Promise<string[]> {
        const folderPathSettings = this.settingsManager.getValue(
            getExtensionSettingKey(this.id, "folders"),
            this.getDefaultSettings().folders,
        );

        const promiseResults = await Promise.allSettled(
            folderPathSettings.map(({ folderPath, recursive }) =>
                this.fileSystemUtility.readDirectory(folderPath, recursive),
            ),
        );

        const filePaths: string[] = [];

        for (const promiseResult of promiseResults) {
            if (promiseResult.status === "fulfilled") {
                filePaths.push(...promiseResult.value);
            } else {
                this.logger.error(`Failed to read directory. Reason: ${promiseResult.reason}`);
                continue;
            }
        }

        return filePaths;
    }

    public isSupported(): boolean {
        return true;
    }

    public getSettingDefaultValue<T>(key: string): T {
        return this.getDefaultSettings()[key] as T;
    }

    public getImage(): Image {
        const filenames: Record<OperatingSystem, string> = {
            Linux: "macos.png",
            macOS: "macos.png",
            Windows: "windows.ico",
        };

        return {
            url: `file://${this.assetPathResolver.getExtensionAssetPath(this.id, filenames[this.operatingSystem])}`,
        };
    }

    public getI18nResources(): Resources<Translations> {
        return {
            "en-US": {
                extensionName: "Simple File Search",
                file: "File",
                folder: "Folder",
                openFile: "Open file",
                openFolder: "Open folder",
            },
            "de-CH": {
                extensionName: "Einfache Dateisuche",
                file: "Datei",
                folder: "Ordner",
                openFile: "Datei öffnen",
                openFolder: "Ordner öffnen",
            },
        };
    }

    private getDefaultSettings(): Settings {
        return {
            folders: [
                {
                    folderPath: this.app.getPath("home"),
                    recursive: false,
                },
            ],
        };
    }

    public getSettingKeysTriggeringRescan() {
        return ["general.language"];
    }
}
