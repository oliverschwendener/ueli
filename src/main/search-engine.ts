import * as Fuse from "fuse.js";
import { SearchResultItem } from "../common/search-result-item";
import { SearchPlugin } from "./search-plugin";
import { UserConfigOptions } from "../common/config/user-config-options";
import { ExecutionPlugin } from "./execution-plugin";
import { UeliPlugin } from "./ueli-plugin";
import { getNoSearchResultsFoundResultItem } from "./no-search-results-found-result-item";
import { TranslationManager } from "../common/translation/translation-manager";
import { TranslationKey } from "../common/translation/translation-key";

interface FuseResult {
    item: SearchResultItem;
}

export class SearchEngine {
    private readonly searchPlugins: SearchPlugin[];
    private readonly executionPlugins: ExecutionPlugin[];
    private readonly translationManager: TranslationManager;
    private config: UserConfigOptions;

    constructor(
        plugins: SearchPlugin[],
        executionPlugins: ExecutionPlugin[],
        config: UserConfigOptions,
        translationManager: TranslationManager) {
        this.translationManager = translationManager;
        this.config = config;
        this.searchPlugins = plugins;
        this.executionPlugins = executionPlugins;
        Promise.resolve(this.refreshIndexes());
    }

    public getSearchResults(userInput: string): Promise<SearchResultItem[]> {
        return new Promise((resolve, reject) => {
            if (userInput === undefined || userInput.length === 0) {
                resolve([]);
            } else {
                const matchingExecutionPlugin = this.executionPlugins
                    .filter((e) => e.isEnabled())
                    .find((e) => e.isValidUserInput(userInput));

                if (matchingExecutionPlugin !== undefined) {
                    matchingExecutionPlugin.getSearchResults(userInput)
                        .then((result) => resolve(this.beforeSolveSearchResults(userInput, result)))
                        .catch((err) => reject(err));
                } else {
                    this.getSearchPluginsResult(userInput)
                        .then((result) => resolve(this.beforeSolveSearchResults(userInput, result)))
                        .catch((err) => reject(err));
                }
            }
        });
    }

    public execute(searchResultItem: SearchResultItem, privileged: boolean): Promise<void> {
        return new Promise((resolve, reject) => {
            let allPlugins: UeliPlugin[] = this.searchPlugins;
            allPlugins = allPlugins.concat(this.executionPlugins);

            const originPlugin = allPlugins.find((plugin) => plugin.pluginType === searchResultItem.originPluginType);

            if (originPlugin !== undefined) {
                originPlugin.execute(searchResultItem, privileged)
                    .then(() => resolve())
                    .catch((err: string) => reject(err));
            } else {
                reject("No plugin found for this search result item");
            }
        });
    }

    public refreshIndexes(): Promise<void> {
        return new Promise((resolve, reject) => {
            const promises = this.searchPlugins.map((p) => p.refreshIndex());
            Promise.all(promises)
                .then(() => resolve())
                .catch((err) => reject(err));
        });
    }

    public clearCaches(): Promise<void> {
        return new Promise((resolve, reject) => {
            const promises = this.searchPlugins.map((p) => p.clearCache());
            Promise.all(promises)
                .then(() => resolve())
                .catch((err) => reject(`Error while trying to clear cache: ${err}`));
        });
    }

    public updateConfig(updatedConfig: UserConfigOptions): Promise<void> {
        return new Promise((resolve, reject) => {
            this.config = updatedConfig;
            let allPlugins: UeliPlugin[] = [];
            allPlugins = allPlugins.concat(this.searchPlugins);
            allPlugins = allPlugins.concat(this.executionPlugins);

            const promises = allPlugins.map((plugin) => plugin.updateConfig(updatedConfig));
            Promise.all(promises)
                .then(() => resolve())
                .catch((err) => reject(err));
        });
    }

    private getSearchPluginsResult(userInput: string): Promise<SearchResultItem[]> {
        return new Promise((resolve, reject) => {
            const pluginPromises = this.searchPlugins
                .filter((p) => p.isEnabled())
                .map((p) => p.getAll());

            Promise.all(pluginPromises)
                .then((pluginsResults) => {
                    let all: SearchResultItem[] = [];

                    pluginsResults.forEach((r) => all = all.concat(r));

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
                    const filtered = fuseResult.map((item: FuseResult): SearchResultItem => item.item);
                    const sliced = filtered.slice(0, this.config.searchEngineOptions.maxSearchResults);

                    resolve(sliced);
                })
                .catch((pluginsError) => {
                    reject(pluginsError);
                });
        });
    }

    private beforeSolveSearchResults(userInput: string, searchResults: SearchResultItem[]): SearchResultItem[] {
        if (userInput.length > 0 && searchResults.length === 0) {
            const result = getNoSearchResultsFoundResultItem(
                this.translationManager.getTranslation(TranslationKey.NoSearchResultsFoundTitle),
                this.translationManager.getTranslation(TranslationKey.NoSearchResultsFoundDescription),
            );
            searchResults.push(result);
        }
        return searchResults;
    }
}
