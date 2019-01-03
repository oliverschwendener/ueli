import * as Fuse from "fuse.js";
import { SearchResultItem } from "../common/search-result-item";
import { SearchPlugin } from "./search-plugin";
import { GeneralOptions } from "../common/config/general-options";

interface FuseResult {
    item: SearchResultItem;
}

export class SearchEngine {
    private readonly plugins: SearchPlugin[];

    constructor(plugins: SearchPlugin[], generalOptions: GeneralOptions) {
        this.plugins = plugins;
        this.plugins.forEach((p) => p.refreshIndex());

        setInterval(() => {
            this.plugins.forEach((p) => p.refreshIndex());
        }, generalOptions.refreshIntervalInSeconds * 1000);
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

                    resolve(filtered);
                })
                .catch((pluginsError) => {
                    reject(pluginsError);
                });
        });
    }
}
