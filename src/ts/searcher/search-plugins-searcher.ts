import { Config } from "../config";
import { TimeHelpers } from "../helpers/time-helpers";
import { SearchEngine } from "../search-engine";
import { SearchPluginManager } from "../search-plugin-manager";
import { SearchResultItem } from "../search-result-item";
import { Searcher } from "./searcher";

export class SearchPluginsSearcher implements Searcher {
    private items: SearchResultItem[];
    private rescanIntervalinMilliseconds = TimeHelpers.convertSecondsToMilliseconds(Config.rescanInterval);

    constructor() {
        this.items = this.loadSearchPluginItems();

        setInterval((): void => {
            this.items = this.loadSearchPluginItems();
        }, this.rescanIntervalinMilliseconds);
    }

    public getSearchResult(userInput: string): SearchResultItem[] {
        const searchEngine = new SearchEngine(this.items);
        return searchEngine.search(userInput);
    }

    private loadSearchPluginItems(): SearchResultItem[] {

        const plugins = new SearchPluginManager().getPlugins();

        const result = plugins.map((plugin) => plugin.getAllItems())
            .reduce((acc, pluginItems) => acc.concat(pluginItems));

        return result;
    }
}
