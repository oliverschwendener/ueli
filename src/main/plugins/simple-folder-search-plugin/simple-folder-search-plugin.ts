import { SearchPlugin } from "../../search-plugin";
import { PluginType } from "../../plugin-type";
import { SearchResultItem } from "../../../common/search-result-item";
import { UserConfigOptions } from "../../../common/config/user-config-options";
import { TranslationSet } from "../../../common/translation/translation-set";
import { SimpleFolderSearchOptions } from "../../../common/config/simple-folder-search-options";
import { basename } from "path";
import { FileHelpers } from "../../../common/helpers/file-helpers";
import { getFileIconDataUrl, FileIconDataResult } from "../../../common/icon/generate-file-icon";
import { defaultFileIcon, defaultFolderIcon } from "../../../common/icon/default-icons";
import { createFilePathDescription } from "../../helpers/file-path-helpers";
import { OpenLocationPlugin } from "../../open-location-plugin";

export class SimpleFolderSearchPlugin implements SearchPlugin, OpenLocationPlugin {
    public pluginType = PluginType.SimpleFolderSearch;
    private config: SimpleFolderSearchOptions;
    private items: SearchResultItem[];
    private readonly filePathExecutor: (filePath: string, privileged?: boolean) => Promise<void>;
    private readonly filePathLocationExecutor: (filePath: string) => Promise<void>;

    constructor(
        config: SimpleFolderSearchOptions,
        filePathExecutor: (filePath: string, privileged?: boolean) => Promise<void>,
        filePathLocationExecutor: (filePath: string) => Promise<void>,
        ) {
        this.config = config;
        this.items = [];
        this.filePathExecutor = filePathExecutor;
        this.filePathLocationExecutor = filePathLocationExecutor;
    }

    public getAll(): Promise<SearchResultItem[]> {
        return new Promise((resolve) => {
            resolve(this.items);
        });
    }

    public refreshIndex(): Promise<void> {
        return new Promise((resolve, reject) => {
            const handleEmptyResult = () => {
                this.items = [];
                resolve();
            };

            if (this.config.folders.length === 0) {
                handleEmptyResult();
            } else {
                const filePromises = this.config.folders.map((folderOption) => {
                    return folderOption.recursive
                        ? FileHelpers.readFilesFromFolderRecursively(folderOption.folderPath, folderOption.excludeHiddenFiles)
                        : FileHelpers.readFilesFromFolder(folderOption.folderPath, folderOption.excludeHiddenFiles);
                });

                Promise.all(filePromises)
                    .then((filePathLists) => {
                        const iconPromises = filePathLists.length > 0
                            ? filePathLists
                                .reduce((all, filePathList) => all = all.concat(filePathList))
                                .map((file) => getFileIconDataUrl(file, defaultFileIcon, defaultFolderIcon))
                            : [];

                        if (iconPromises.length === 0) {
                            handleEmptyResult();
                        } else {
                            Promise.all(iconPromises)
                            .then((iconResults) => {
                                this.items = iconResults.map((iconResult): SearchResultItem => this.buildSearchResultItem(iconResult));
                                resolve();
                            })
                            .catch((err) => reject(err));
                        }
                    })
                    .catch((err) => reject(err));
            }
        });
    }

    public clearCache(): Promise<void> {
        return new Promise((resolve) => {
            resolve();
        });
    }

    public isEnabled(): boolean {
        return this.config.isEnabled;
    }

    public execute(searchResultItem: SearchResultItem, privileged: boolean): Promise<void> {
        return this.filePathExecutor(searchResultItem.executionArgument, privileged);
    }

    public openLocation(searchResultItem: SearchResultItem): Promise<void> {
        return this.filePathLocationExecutor(searchResultItem.executionArgument);
    }

    public updateConfig(updatedConfig: UserConfigOptions, translationSet: TranslationSet): Promise<void> {
        return new Promise((resolve) => {
            this.config = updatedConfig.simpleFolderSearchOptions;
            resolve();
        });
    }

    private buildSearchResultItem(iconResult: FileIconDataResult): SearchResultItem {
        return {
            description: createFilePathDescription(iconResult.filePath, {
                showFullFilePath: this.config.showFullFilePath,
            }),
            executionArgument: iconResult.filePath,
            hideMainWindowAfterExecution: true,
            icon: iconResult.icon,
            name: basename(iconResult.filePath),
            needsUserConfirmationBeforeExecution: false,
            originPluginType: this.pluginType,
            searchable: [basename(iconResult.filePath)],
            supportsOpenLocation: true,
        };
    }
}
