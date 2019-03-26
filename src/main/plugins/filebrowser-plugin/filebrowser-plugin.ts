import { ExecutionPlugin } from "../../execution-plugin";
import { PluginType } from "../../plugin-type";
import { SearchResultItem } from "../../../common/search-result-item";
import { UserConfigOptions } from "../../../common/config/user-config-options";
import { TranslationSet } from "../../../common/translation/translation-set";
import { FileBrowserOptions } from "../../../common/config/filebrowser-options";
import { FileHelpers } from "../../helpers/file-helpers";
import { basename, dirname, join, sep } from "path";
import { existsSync, lstatSync } from "fs";
import Fuse = require("fuse.js");
import { AutoCompletionResult } from "../../../common/auto-completion-result";
import { defaultFolderIcon, defaultFileIcon } from "../../../common/icon/default-icons";

export class FileBrowserExecutionPlugin implements ExecutionPlugin {
    public readonly pluginType: PluginType.FileBrowserPlugin;
    public readonly openLocationSupported = true;
    public readonly autoCompletionSupported = true;
    private config: FileBrowserOptions;
    private readonly filePathValidator: (filePath: string) => boolean;
    private readonly filePathExecutor: (filePath: string, privileged?: boolean) => Promise<void>;
    private readonly fileLocationExecutor: (filePath: string) => Promise<void>;

    constructor(
        config: FileBrowserOptions,
        filePathValidator: (filePath: string) => boolean,
        filePathExecutor: (filePath: string, privileged?: boolean) => Promise<void>,
        fileLocationExecutor: (filePath: string) => Promise<void>,
    ) {
        this.config = config;
        this.filePathValidator = filePathValidator;
        this.filePathExecutor = filePathExecutor;
        this.fileLocationExecutor = fileLocationExecutor;
    }

    public isValidUserInput(userInput: string, fallback?: boolean): boolean {
        const filePaths = [userInput, dirname(userInput)].filter((filePath) => filePath !== ".");
        return filePaths.some((filePath) => this.filePathValidator(filePath) && existsSync(filePath));
    }

    public getSearchResults(userInput: string, fallback?: boolean): Promise<SearchResultItem[]> {
        return new Promise((resolve, reject) => {
            const userInputIsExactMatch = existsSync(userInput);
            const filePath = userInputIsExactMatch ? userInput : dirname(userInput);
            const searchTerm = userInputIsExactMatch ? undefined : basename(userInput);
            this.handleFilePath(filePath, searchTerm)
                .then((results) => resolve(results))
                .catch((err) => reject(err));
        });
    }

    public isEnabled(): boolean {
        return this.config.isEnabled;
    }

    public execute(searchResultItem: SearchResultItem, privileged: boolean): Promise<void> {
        return this.filePathExecutor(searchResultItem.executionArgument, privileged);
    }

    public openLocation(searchResultItem: SearchResultItem): Promise<void> {
        return this.fileLocationExecutor(searchResultItem.executionArgument);
    }

    public autoComplete(searchResultItem: SearchResultItem): Promise<AutoCompletionResult> {
        return new Promise((resolve, reject) => {
            this.handleFilePath(searchResultItem.executionArgument)
                .then((results) => {
                    resolve({
                        results,
                        updatedUserInput: searchResultItem.executionArgument.endsWith(sep)
                            ? searchResultItem.executionArgument
                            : `${searchResultItem.executionArgument}${sep}`,
                    });
                })
                .catch((err) => reject(err));
        });
    }

    public updateConfig(updatedConfig: UserConfigOptions, translationSet: TranslationSet): Promise<void> {
        return new Promise((resolve) => {
            this.config = updatedConfig.fileBrowserOptions;
            resolve();
        });
    }

    private handleFilePath(filePath: string, searchTerm?: string): Promise<SearchResultItem[]> {
        return new Promise((resolve, reject) => {
            FileHelpers.getStats(filePath)
            .then((stats) => {
                if (stats.stats.isDirectory() && !stats.stats.isSymbolicLink()) {
                    FileHelpers.getFilesFromFolder(filePath)
                        .then((files) => resolve(this.buildSearchResults(files, filePath, searchTerm)))
                        .catch((err) => reject(err));
                } else if (stats.stats.isFile() && !stats.stats.isSymbolicLink()) {
                    resolve([]);
                } else {
                    resolve([]);
                }
            })
            .catch((err) => reject(err));
        });
    }

    private buildSearchResults(files: string[], parentFolder: string, searchTerm?: string): SearchResultItem[] {
        const unsortedReults = files
            .filter((file) => {
                if (this.config.showHiddenFiles) {
                    return true;
                } else {
                    return !basename(file).startsWith(".");
                }
            })
            .map((file): SearchResultItem => {
                const filePath = join(parentFolder, file);
                const stats = lstatSync(filePath);
                return {
                    description: filePath,
                    executionArgument: filePath,
                    hideMainWindowAfterExecution: true,
                    icon: stats.isFile() ? defaultFileIcon : defaultFolderIcon,
                    name: file,
                    originPluginType: this.pluginType,
                    searchable: [file],
                };
            });

        let sortedResutls: SearchResultItem[] = [];

        if (searchTerm) {
            const fuse = new Fuse(unsortedReults, {
                distance: 100,
                includeScore: true,
                keys: ["searchable"],
                location: 0,
                maxPatternLength: 32,
                minMatchCharLength: 1,
                shouldSort: true,
                threshold: 0.4,
            });
            const fuseResult = fuse.search(searchTerm) as any[];
            sortedResutls = fuseResult.map((item) => item.item);
        } else {
            sortedResutls = unsortedReults;
        }

        return sortedResutls
            .splice(0, this.config.maxSearchResults);
    }
}
