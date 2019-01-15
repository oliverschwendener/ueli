import * as Fuse from "fuse.js";
import { SearchResultItem } from "../common/search-result-item";
import { SearchPlugin } from "./search-plugin";
import { UserConfigOptions } from "../common/config/user-config-options";

interface FuseResult {
    item: SearchResultItem;
}

export class SearchEngine {
    private readonly plugins: SearchPlugin[];
    private config: UserConfigOptions;

    constructor(plugins: SearchPlugin[], config: UserConfigOptions) {
        this.config = config;
        this.plugins = plugins;
        Promise.resolve(this.refreshIndexes());
    }

    public getSearchResults(userInput: string): Promise<SearchResultItem[]> {
        return new Promise((resolve, reject) => {
            if (userInput === undefined || userInput.length === 0) {
                resolve([]);
            }

            const pluginPromises = this.plugins
                .filter((p) => p.isEnabled())
                .map((p) => p.getAll());

            Promise.all(pluginPromises)
                .then((pluginsResults) => {
                    let all: SearchResultItem[] = [];

                    pluginsResults.forEach((r) => all = all.concat(r));

                    const fuse = new Fuse(all, {
                        distance: 100,
                        includeScore: true,
                        keys: ["name"],
                        location: 0,
                        maxPatternLength: 32,
                        minMatchCharLength: 1,
                        shouldSort: true,
                        threshold: this.config.searchEngineOptions.fuzzyness,
                    });

                    const fuseResult = fuse.search(userInput) as any[];
                    const filtered = fuseResult.map((item: FuseResult): SearchResultItem => item.item);
                    const sliced = filtered.slice(0, this.config.appearanceOptions.maxSearchResults);

                    resolve(sliced);
                })
                .catch((pluginsError) => {
                    reject(pluginsError);
                });
        });
    }

    public execute(searchResultItem: SearchResultItem): Promise<void> {
        return new Promise((resolve, reject) => {
            const originPlugin = this.plugins.find((plugin) => plugin.pluginType === searchResultItem.originPluginType);
            if (originPlugin !== undefined) {
                originPlugin.execute(searchResultItem)
                    .then(() => resolve())
                    .catch((err) => reject(err));
            } else {
                reject("No plugin found for this search result item");
            }
        });
    }

    public refreshIndexes(): Promise<void> {
        return new Promise((resolve, reject) => {
            const promises = this.plugins.map((p) => p.refreshIndex());
            Promise.all(promises)
                .then(() => {
                    resolve();
                })
                .catch((err) => {
                    reject(err);
                });
        });
    }

    public clearCaches(): Promise<void> {
        return new Promise((resolve, reject) => {
            const promises = this.plugins.map((p) => p.clearCache());
            Promise.all(promises)
                .then(() => {
                    resolve();
                })
                .catch((err) => {
                    reject(`Error while trying to clear cache: ${err}`);
                });
        });
    }

    public updateConfig(updatedConfig: UserConfigOptions): Promise<void> {
        return new Promise((resolve, reject) => {
            this.config = updatedConfig;
            const promises = this.plugins.map((plugin) => plugin.updateConfig(updatedConfig));
            Promise.all(promises)
                .then(() => resolve())
                .catch((err) => reject(err));
        });
    }
}
