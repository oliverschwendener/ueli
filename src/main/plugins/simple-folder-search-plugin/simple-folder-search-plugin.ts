import { SearchPlugin } from "../../search-plugin";
import { PluginType } from "../../plugin-type";
import { SearchResultItem } from "../../../common/search-result-item";
import { UserConfigOptions } from "../../../common/config/user-config-options";
import { TranslationSet } from "../../../common/translation/translation-set";
import { SimpleFolderSearchOptions } from "../../../common/config/simple-folder-search-options";
import { basename, sep } from "path";
import { FileIconDataResult, getFileIconDataUrl } from "../../../common/icon/generate-file-icon";
import { createFilePathDescription } from "../../helpers/file-path-helpers";
import { OpenLocationPlugin } from "../../open-location-plugin";
import { FileSearchOption } from "../../executors/file-searchers";
import { defaultFileIcon, defaultFolderIcon } from "../../../common/icon/default-icons";
import { AutoCompletionPlugin } from "../../auto-completion-plugin";

export class SimpleFolderSearchPlugin implements SearchPlugin, AutoCompletionPlugin, OpenLocationPlugin {
    public pluginType = PluginType.SimpleFolderSearch;
    private config: SimpleFolderSearchOptions;
    private items: FileIconDataResult[];
    private readonly fileSearcher: (options: FileSearchOption) => Promise<string[]>;
    private readonly filePathExecutor: (filePath: string, privileged?: boolean) => Promise<void>;
    private readonly filePathLocationExecutor: (filePath: string) => Promise<void>;

    constructor(
        config: SimpleFolderSearchOptions,
        fileSearcher: (options: FileSearchOption) => Promise<string[]>,
        filePathExecutor: (filePath: string, privileged?: boolean) => Promise<void>,
        filePathLocationExecutor: (filePath: string) => Promise<void>,
    ) {
        this.config = config;
        this.items = [];
        this.fileSearcher = fileSearcher;
        this.filePathExecutor = filePathExecutor;
        this.filePathLocationExecutor = filePathLocationExecutor;
    }

    public getAll(): Promise<SearchResultItem[]> {
        return new Promise((resolve) => {
            resolve(this.items.map((item) => this.buildSearchResultItem(item)));
        });
    }

    public refreshIndex(): Promise<void> {
        return new Promise((resolve, reject) => {
            if (this.config.folders.length === 0) {
                resolve();
            } else {
                const searchPromises = this.config.folders.map((folder) => {
                    return this.fileSearcher({
                        blacklist: [],
                        folderPath: folder.folderPath,
                        recursive: folder.recursive,
                    });
                });

                Promise.all(searchPromises)
                    .then((resultLists) => {
                        const results = resultLists.reduce((all, resultList) => (all = all.concat(resultList)));
                        const iconPromises = results.map((r) =>
                            getFileIconDataUrl(r, defaultFileIcon, defaultFolderIcon),
                        );
                        Promise.all(iconPromises)
                            .then((fileIconDataResults) => {
                                this.items = fileIconDataResults;
                                resolve();
                            })
                            .catch((err) => reject(err));
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
    public autoComplete(searchResultItem: SearchResultItem): string {
        return searchResultItem.executionArgument.endsWith(sep)
            ? searchResultItem.executionArgument
            : `${searchResultItem.executionArgument}${sep}`;
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

    private buildSearchResultItem(item: FileIconDataResult): SearchResultItem {
        return {
            description: createFilePathDescription(item.filePath, {
                showFullFilePath: this.config.showFullFilePath,
            }),
            executionArgument: item.filePath,
            hideMainWindowAfterExecution: true,
            icon: item.icon,
            name: basename(item.filePath),
            needsUserConfirmationBeforeExecution: false,
            originPluginType: this.pluginType,
            searchable: [basename(item.filePath)],
            supportsOpenLocation: true,
            supportsAutocompletion: true,
        };
    }
}
