import { Searcher } from "./searcher";
import { SearchResultItem, SearchEngine } from "../search-engine";
import { SearchPluginManager } from "../search-plugin-manager";

export class SearchPluginsSearcher implements Searcher {
    private items = this.loadSearchPluginItems();

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