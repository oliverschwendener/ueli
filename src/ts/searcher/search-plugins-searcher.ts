import { Searcher } from "./searcher";
import { SearchResultItem, SearchEngine } from "../search-engine";
import { SearchPluginManager } from "../search-plugin-manager";
import { Config } from "../config";
import { TimeHelpers } from "../helpers/time-helpers";

export class SearchPluginsSearcher implements Searcher {
    private items: SearchResultItem[];

    constructor() {
        this.items = this.loadSearchPluginItems();

        setInterval((): void => {
            console.log("updating");
            this.items = this.loadSearchPluginItems();
        }, TimeHelpers.convertSecondsToMilliseconds(Config.rescanInterval));
    }

    public getSearchResult(userInput: string): SearchResultItem[] {
        let searchEngine = new SearchEngine(this.items);
        return searchEngine.search(userInput);
    }

    private loadSearchPluginItems(): SearchResultItem[] {
        let result = [] as SearchResultItem[];

        let plugins = new SearchPluginManager().getPlugins();

        for (let plugin of plugins) {
            result = result.concat(plugin.getAllItems());
        }

        return result;
    }
}