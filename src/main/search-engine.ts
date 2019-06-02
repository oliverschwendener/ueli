import * as Fuse from "fuse.js";
import { SearchResultItem } from "../common/search-result-item";
import { SearchPlugin } from "./search-plugin";
import { UserConfigOptions } from "../common/config/user-config-options";
import { ExecutionPlugin } from "./execution-plugin";
import { UeliPlugin } from "./ueli-plugin";
import { TranslationSet } from "../common/translation/translation-set";
import { getNoSearchResultsFoundResultItem } from "./no-search-results-found-result-item";
import { Logger } from "../common/logger/logger";
import { AutoCompletionResult } from "../common/auto-completion-result";
import { FavoriteRepository } from "./favorites/favorite-repository";
import { FavoriteManager } from "./favorites/favorites-manager";

interface FuseResult {
    item: SearchResultItem;
    score: number;
}

export class SearchEngine {
    private readonly searchPlugins: SearchPlugin[];
    private readonly executionPlugins: ExecutionPlugin[];
    private readonly fallbackPlugins: ExecutionPlugin[];
    private translationSet: TranslationSet;
    private config: UserConfigOptions;
    private readonly favoriteManager: FavoriteManager;
    private readonly logger: Logger;

    constructor(
        plugins: SearchPlugin[],
        executionPlugins: ExecutionPlugin[],
        fallbackPlugins: ExecutionPlugin[],
        config: UserConfigOptions,
        translationSet: TranslationSet,
        logger: Logger,
        favoriteRepository: FavoriteRepository) {
        this.translationSet = translationSet;
        this.config = config;
        this.searchPlugins = plugins;
        this.executionPlugins = executionPlugins;
        this.fallbackPlugins = fallbackPlugins;
        this.logger = logger;
        this.favoriteManager = new FavoriteManager(favoriteRepository, translationSet);
        (async () => {
            try {
                await this.refreshIndexes();
                this.logger.debug(translationSet.successfullyRefreshedIndexes);
            } catch (error) {
                this.logger.error(error);
            }
          })();
    }

    public async getSearchResults(userInput: string): Promise<SearchResultItem[]> {
        try {
            if (userInput === undefined || userInput.length === 0) {
                return [];
            } else {
                const matchingExecutionPlugin = this.executionPlugins
                    .filter((e) => e.isEnabled())
                    .find((e) => e.isValidUserInput(userInput));

                if (matchingExecutionPlugin !== undefined) {
                        const executionPluginResults = await matchingExecutionPlugin.getSearchResults(userInput);
                        const result = await this.beforeSolveSearchResults(userInput, executionPluginResults);
                        return result;
                    } else {
                        const searchPluginResults = await this.getSearchPluginsResult(userInput);
                        const result = this.beforeSolveSearchResults(userInput, searchPluginResults);
                        return result;
                    }
            }
        } catch (error) {
            return error;
        }
    }

    public async getFavorites(): Promise<SearchResultItem[]> {
        try {
            const result = this.favoriteManager.getAllFavorites()
                .sort((a, b) => b.executionCount - a.executionCount)
                .map((f) => f.item);
            return result;
        } catch (error) {
            return error;
        }
    }

    public async execute(searchResultItem: SearchResultItem, privileged: boolean): Promise<void> {
        try {
            const originPlugin = this.getAllPlugins().find((plugin) => plugin.pluginType === searchResultItem.originPluginType);
            if (originPlugin !== undefined) {
                await originPlugin.execute(searchResultItem, privileged);
                if (this.config.generalOptions.logExecution) {
                    this.favoriteManager.increaseCount(searchResultItem);
                }
            } else {
                throw Error("Error while trying to execute search result item. No plugin found for this search result item");
            }
        } catch (error) {
            return error;
        }
    }

    public async openLocation(searchResultItem: SearchResultItem): Promise<void> {
        const pluginsWithOpenLocationSupport = this.getAllPlugins().filter((plugin) => plugin.openLocationSupported);
        const originPlugin = pluginsWithOpenLocationSupport.find((plugin) => plugin.pluginType === searchResultItem.originPluginType);
        if (originPlugin !== undefined) {
            try {
                await originPlugin.openLocation(searchResultItem);
            } catch (error) {
                return error;
            }
        } else {
            throw Error("Error while trying to open file location. No plugin found for the search result item");
        }
    }

    public async autoComplete(searchResultItem: SearchResultItem): Promise<AutoCompletionResult> {
        const pluginsWithAutoCompleteSupport = this.getAllPlugins().filter((plugin) => plugin.autoCompletionSupported);
        const originPlugin = pluginsWithAutoCompleteSupport.find((plugin) => plugin.pluginType === searchResultItem.originPluginType);
        if (originPlugin) {
            try {
                const result = await originPlugin.autoComplete(searchResultItem);
                return result;
            } catch (error) {
                return error;
            }
        } else {
            throw Error("Error while trying to autocomplete. No plugin found for the search result item");
        }
    }

    public async refreshIndexes(): Promise<void> {
        try {
            await Promise.all(this.searchPlugins.map((plugin) => plugin.refreshIndex()));
        } catch (error) {
            return error;
        }
    }

    public async clearCaches(): Promise<void> {
        try {
            await Promise.all(this.searchPlugins.map((plugin) => plugin.clearCache()));
        } catch (error) {
            return error;
        }
    }

    public async updateConfig(updatedConfig: UserConfigOptions, translationSet: TranslationSet): Promise<void> {
        try {
            this.translationSet = translationSet;
            this.favoriteManager.updateTranslationSet(translationSet);
            this.config = updatedConfig;
            await Promise.all(this.getAllPlugins().map((plugin) => plugin.updateConfig(updatedConfig, translationSet)));
        } catch (error) {
            return error;
        }
    }

    public clearExecutionLog(): Promise<void> {
        return this.favoriteManager.clearExecutionLog();
    }

    public getLogger(): Logger {
        return this.logger;
    }

    private async getSearchPluginsResult(userInput: string): Promise<SearchResultItem[]> {
        try {
            const pluginPromises = this.searchPlugins
                .filter((plugin) => plugin.isEnabled())
                .map((plugin) => plugin.getAll());

            const pluginsResults = (await Promise.all(pluginPromises)).flat();

            const fuse = new Fuse(pluginsResults, {
                distance: 100,
                includeScore: true,
                keys: ["searchable"],
                location: 0,
                maxPatternLength: 32,
                minMatchCharLength: 1,
                shouldSort: true,
                threshold: this.config.searchEngineOptions.fuzzyness,
            });

            const fuseResult = fuse.search(userInput) as any[];
            if (this.config.generalOptions.logExecution) {
                fuseResult.forEach((fuseResultItem: FuseResult) => {
                    const favorite = this.favoriteManager.getAllFavorites()
                        .find((f) => f.item.executionArgument === fuseResultItem.item.executionArgument);
                    if (favorite && favorite.executionCount !== 0) {
                        fuseResultItem.score /= favorite.executionCount * 3;
                    }
                });
            }
            const sorted = fuseResult.sort((a: FuseResult, b: FuseResult) => a.score  - b.score);
            const filtered = sorted.map((item: FuseResult): SearchResultItem => item.item);
            const sliced = filtered.slice(0, this.config.searchEngineOptions.maxSearchResults);
            return sliced;

        } catch (error) {
            return error;
        }
    }

    private async beforeSolveSearchResults(userInput: string, searchResults: SearchResultItem[]): Promise<SearchResultItem[]> {
        try {
            if (this.fallbackPlugins.length > 0 && searchResults.length === 0) {
                const fallbackPluginPromises = this.fallbackPlugins
                .filter((fallbackPlugin) => fallbackPlugin.isValidUserInput(userInput, true))
                .map((fallbackPlugin) => fallbackPlugin.getSearchResults(userInput, true));

                const resultList = await Promise.all(fallbackPluginPromises);
                const result = resultList.length > 0
                        ? resultList.flat()
                        : [];
                return this.beforeResolve(userInput, result);
            } else {
                return this.beforeResolve(userInput, searchResults);
            }
        } catch (error) {
            return error;
        }
    }

    private beforeResolve(userInput: string, searchResults: SearchResultItem[]): SearchResultItem[] {
        if (userInput.length > 0 && searchResults.length === 0) {
            const result = getNoSearchResultsFoundResultItem(
                this.translationSet.noSearchResultsFoundTitle,
                this.translationSet.noSearchResultsFoundDescription,
            );
            searchResults.push(result);
        }

        return(searchResults);
    }

    private getAllPlugins(): UeliPlugin[] {
        let allPlugins: UeliPlugin[] = [];
        allPlugins = allPlugins.concat(this.searchPlugins);
        allPlugins = allPlugins.concat(this.executionPlugins);
        return allPlugins;
    }
}
