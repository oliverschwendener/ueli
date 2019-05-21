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
        this.refreshIndexes()
            .then(() => this.logger.debug(translationSet.successfullyRefreshedIndexes))
            .catch((err) => this.logger.error(err));
    }

    public  getSearchResults(userInput: string): Promise<SearchResultItem[]> {
        return new Promise((resolve, reject) => {
            if (userInput === undefined || userInput.length === 0) {
                resolve([]);
            } else {
                const matchingExecutionPlugin = this.executionPlugins
                    .filter((e) => e.isEnabled())
                    .find((e) => e.isValidUserInput(userInput));

                if (matchingExecutionPlugin !== undefined) {
                    matchingExecutionPlugin.getSearchResults(userInput)
                        .then((executionPluginResults) => {
                            this.beforeSolveSearchResults(userInput, executionPluginResults)
                                .then((result) => resolve(result))
                                .catch((err) => reject(err));
                        })
                        .catch((err) => reject(err));
                } else {
                    this.getSearchPluginsResult(userInput)
                        .then((searchPluginResults) => {
                            this.beforeSolveSearchResults(userInput, searchPluginResults)
                                .then((result) => resolve(result))
                                .catch((err) => reject(err));
                        })
                        .catch((err) => reject(err));
                }
            }
        });
    }

    public getFavorites(): Promise<SearchResultItem[]> {
        return new Promise((resolve) => {
            const result = this.favoriteManager.getAllFavorites()
                .sort((a, b) => b.executionCount - a.executionCount)
                .map((f) => f.item);

            resolve(result);
        });
    }

    public execute(searchResultItem: SearchResultItem, privileged: boolean): Promise<void> {
        return new Promise((resolve, reject) => {
            const originPlugin = this.getAllPlugins().find((plugin) => plugin.pluginType === searchResultItem.originPluginType);
            if (originPlugin !== undefined) {
                originPlugin.execute(searchResultItem, privileged)
                    .then(() => {
                        if (this.config.generalOptions.logExecution) {
                            this.favoriteManager.increaseCount(searchResultItem);
                        }

                        resolve();
                    })
                    .catch((err: string) => reject(err));
            } else {
                reject("Error while trying to execute search result item. No plugin found for this search result item");
            }
        });
    }

    public openLocation(searchResultItem: SearchResultItem): Promise<void> {
        return new Promise((resolve, reject) => {
            const pluginsWithOpenLocationSupport = this.getAllPlugins().filter((plugin) => plugin.openLocationSupported);
            const originPlugin = pluginsWithOpenLocationSupport.find((plugin) => plugin.pluginType === searchResultItem.originPluginType);
            if (originPlugin !== undefined) {
                originPlugin.openLocation(searchResultItem)
                    .then(() => resolve())
                    .catch((err) => reject(err));
            } else {
                reject("Error while trying to open file location. No plugin found for the search result item");
            }
        });
    }

    public autoComplete(searchResultItem: SearchResultItem): Promise<AutoCompletionResult> {
        return new Promise((resolve, reject) => {
            const pluginsWithAutoCompleteSupport = this.getAllPlugins().filter((plugin) => plugin.autoCompletionSupported);
            const originPlugin = pluginsWithAutoCompleteSupport.find((plugin) => plugin.pluginType === searchResultItem.originPluginType);
            if (originPlugin) {
                originPlugin.autoComplete(searchResultItem)
                    .then((result) => resolve(result))
                    .catch((err) => reject(err));
            } else {
                reject("Error while trying to autocomplete. No plugin found for the search result item");
            }
        });
    }

    public refreshIndexes(): Promise<void> {
        return new Promise((resolve, reject) => {
            Promise.all(this.searchPlugins.map((plugin) => plugin.refreshIndex()))
                .then(() => resolve())
                .catch((err) => reject(err));
        });
    }

    public clearCaches(): Promise<void> {
        return new Promise((resolve, reject) => {
            Promise.all(this.searchPlugins.map((plugin) => plugin.clearCache()))
                .then(() => resolve())
                .catch((err) => reject(`Error while trying to clear cache: ${err}`));
        });
    }

    public updateConfig(updatedConfig: UserConfigOptions, translationSet: TranslationSet): Promise<void> {
        return new Promise((resolve, reject) => {
            this.translationSet = translationSet;
            this.favoriteManager.updateTranslationSet(translationSet);

            this.config = updatedConfig;

            Promise.all(this.getAllPlugins().map((plugin) => plugin.updateConfig(updatedConfig, translationSet)))
                .then(() => resolve())
                .catch((err) => reject(err));
        });
    }

    public clearExecutionLog(): Promise<void> {
        return this.favoriteManager.clearExecutionLog();
    }

    public getLogger(): Logger {
        return this.logger;
    }

    private getSearchPluginsResult(userInput: string): Promise<SearchResultItem[]> {
        return new Promise((resolve, reject) => {
            const pluginPromises = this.searchPlugins
                .filter((plugin) => plugin.isEnabled())
                .map((plugin) => plugin.getAll());

            Promise.all(pluginPromises)
                .then((pluginsResults) => {
                    const all = pluginsResults.length > 0
                        ? pluginsResults.reduce((a, r) => a = a.concat(r))
                        : [];

                    const fuse = new Fuse(all, {
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

                    resolve(sliced);
                })
                .catch((pluginsError) => {
                    reject(pluginsError);
                });
        });
    }

    private beforeSolveSearchResults(userInput: string, searchResults: SearchResultItem[]): Promise<SearchResultItem[]> {
        return new Promise((resolve, reject) => {
            if (this.fallbackPlugins.length > 0 && searchResults.length === 0) {
                const fallbackPluginPromises = this.fallbackPlugins
                    .filter((fallbackPlugin) => fallbackPlugin.isValidUserInput(userInput, true))
                    .map((fallbackPlugin) => fallbackPlugin.getSearchResults(userInput, true));

                Promise.all(fallbackPluginPromises)
                    .then((resultLists) => {
                        const result = resultLists.length > 0
                            ? resultLists.reduce((all, r) => all = all.concat(r))
                            : [];

                        resolve(this.beforeResolve(userInput, result));
                    })
                    .catch((err) => reject(err));
            } else {
                resolve(this.beforeResolve(userInput, searchResults));
            }
        });
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
