import { ExecutionPlugin } from "../../execution-plugin";
import { PluginType } from "../../plugin-type";
import { SearchResultItem } from "../../../common/search-result-item";
import { UserConfigOptions } from "../../../common/config/user-config-options";
import { TranslationSet } from "../../../common/translation/translation-set";
import { FileBrowserOptions } from "../../../common/config/filebrowser-options";
import { FileHelpers } from "../../../common/helpers/file-helpers";
import { basename, dirname, sep } from "path";
import { existsSync } from "fs";
import { AutoCompletionResult } from "../../../common/auto-completion-result";
import { FileIconDataResult } from "../../../common/icon/generate-file-icon";
import { defaultFileIcon, defaultFolderIcon } from "../../../common/icon/default-icons";
import { Icon } from "../../../common/icon/icon";
import Fuse = require("fuse.js");
import { createFilePathDescription } from "../../helpers/file-path-helpers";

export class FileBrowserExecutionPlugin implements ExecutionPlugin {
    public readonly pluginType: PluginType.FileBrowserPlugin;
    public readonly openLocationSupported = true;
    public readonly autoCompletionSupported = true;
    private config: FileBrowserOptions;
    private readonly filePathValidator: (filePath: string) => boolean;
    private readonly filePathExecutor: (filePath: string, privileged?: boolean) => Promise<void>;
    private readonly fileLocationExecutor: (filePath: string) => Promise<void>;
    private readonly fileIconGenerator: (filePath: string, defaultFileIcon: Icon, defaultFolderIcon: Icon) => Promise<FileIconDataResult>;

    constructor(
        config: FileBrowserOptions,
        filePathValidator: (filePath: string) => boolean,
        filePathExecutor: (filePath: string, privileged?: boolean) => Promise<void>,
        fileLocationExecutor: (filePath: string) => Promise<void>,
        fileIconGenerator: (filePath: string, defaultFileIcon: Icon, defaultFolderIcon: Icon) => Promise<FileIconDataResult>,
    ) {
        this.config = config;
        this.filePathValidator = filePathValidator;
        this.filePathExecutor = filePathExecutor;
        this.fileLocationExecutor = fileLocationExecutor;
        this.fileIconGenerator = fileIconGenerator;
    }

    public isValidUserInput(userInput: string, fallback?: boolean): boolean {
        const filePaths = [userInput, dirname(userInput)].filter((filePath) => filePath !== ".");
        return filePaths.some((filePath) => this.filePathValidator(filePath) && existsSync(filePath));
    }

    public async getSearchResults(userInput: string, fallback?: boolean): Promise<SearchResultItem[]> {
        try {
            const userInputIsExactMatch = existsSync(userInput);
            const filePath = userInputIsExactMatch ? userInput : dirname(userInput);
            const searchTerm = userInputIsExactMatch ? undefined : basename(userInput);
            const results = await this.handleFilePath(filePath, searchTerm);
            return results;
        } catch (error) {
            return error;
        }
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

    public async autoComplete(searchResultItem: SearchResultItem): Promise<AutoCompletionResult> {
        try {
            const updatedUserInput = searchResultItem.executionArgument.endsWith(sep)
                ? searchResultItem.executionArgument
                : `${searchResultItem.executionArgument}${sep}`;
            const results = await this.handleFilePath(updatedUserInput);
            return {
                results,
                updatedUserInput,
            };
        } catch (error) {
            return error;
        }
    }

    public async updateConfig(updatedConfig: UserConfigOptions, translationSet: TranslationSet): Promise<void> {
        this.config = updatedConfig.fileBrowserOptions;
    }

    private async handleFilePath(filePath: string, searchTerm?: string): Promise<SearchResultItem[]> {
        try {
            const stats = await FileHelpers.getStats(filePath);
            if (stats.stats.isDirectory() && !stats.stats.isSymbolicLink()) {
                const filePaths = await FileHelpers.readFilesFromFolder(filePath);
                const results = await this.buildSearchResults(filePaths, filePath, searchTerm);
                return results;
            } else if (stats.stats.isDirectory() && !stats.stats.isSymbolicLink()) {
                return [];
            } else {
                return [];
            }
        } catch (error) {
            return error;
        }
    }

    private async buildSearchResults(filePaths: string[], parentFolder: string, searchTerm?: string): Promise<SearchResultItem[]> {
        try {
            const unsortedResults = filePaths.filter((filePath) => {
                if (this.config.showHiddenFiles) {
                    return true;
                } else {
                    return !basename(filePath).startsWith(".");
                }
            })
            .filter((filePath) => {
                if (this.config.blackList.length > 0) {
                    return this.config.blackList.every((blackListEntry) => {
                        return blackListEntry !== basename(filePath);
                    });
                } else {
                    return true;
                }
            })
            .map((filePath): SearchResultItem => {
                return {
                    description: createFilePathDescription(filePath),
                    executionArgument: filePath,
                    hideMainWindowAfterExecution: true,
                    icon: defaultFileIcon,
                    name: basename(filePath),
                    originPluginType: this.pluginType,
                    searchable: [basename(filePath)],
                };
            });
            const promises = unsortedResults.map((unsortedResult) => this.fileIconGenerator(unsortedResult.executionArgument, defaultFileIcon, defaultFolderIcon));
            const iconResults = await Promise.all(promises);
            unsortedResults.forEach((unsortedResult) => {
                const icon = iconResults.find((iconResult) => iconResult.filePath === unsortedResult.executionArgument);
                if (icon) {
                    unsortedResult.icon = icon.icon;
                }
            });
            return this.sortResults(unsortedResults, searchTerm);
        } catch (error) {
            return error;
        }
    }

    private sortResults(unsortedResults: SearchResultItem[], searchTerm?: string): SearchResultItem[] {
        let sortedResutls: SearchResultItem[] = [];

        if (searchTerm) {
            const fuse = new Fuse(unsortedResults, {
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
            sortedResutls = unsortedResults;
        }

        return sortedResutls.splice(0, this.config.maxSearchResults);
    }
}
