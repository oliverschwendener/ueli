import * as Fuse from "fuse.js";
import { SearchResultItem } from "../common/search-result-item";
import { SearchPlugin } from "./search-plugin";
import { GeneralOptions } from "../common/config/general-options";

interface FuseResult {
    item: SearchResultItem;
}

export class SearchEngine {
    private readonly plugins: SearchPlugin[];
    private readonly options: GeneralOptions;

    constructor(plugins: SearchPlugin[], generalOptions: GeneralOptions) {
        this.options = generalOptions;
        this.plugins = plugins;
        Promise.resolve(this.refreshIndexes());
    }

    public getSearchResults(userInput: string): Promise<SearchResultItem[]> {
        return new Promise((resolve, reject) => {
            if (userInput === undefined || userInput.length === 0) {
                resolve([]);
            }

            const pluginPromises = this.plugins.map((p) => p.getAll());

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
                        threshold: 0.4,
                    });

                    const fuseResult = fuse.search(userInput) as any[];
                    const filtered = fuseResult.map((item: FuseResult): SearchResultItem => item.item);
                    const sliced = filtered.slice(0, this.options.maxSearchResults);

                    resolve(sliced);
                })
                .catch((pluginsError) => {
                    reject(pluginsError);
                });
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

    public clearCache(): Promise<void> {
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
}
