import { TimeHelpers } from "../helpers/time-helpers";
import { SearchEngine } from "../search-engine";
import { SearchPluginManager } from "../search-plugin-manager";
import { SearchResultItem } from "../search-result-item";
import { Searcher } from "./searcher";
import { defaultConfig } from "../default-config";
import { ConfigOptions } from "../config-options";

export class SearchPluginsSearcher implements Searcher {
    private items: SearchResultItem[];
    private rescanIntervalinMilliseconds = TimeHelpers.convertSecondsToMilliseconds(defaultConfig.rescanInterval);

    constructor(config: ConfigOptions) {
        this.items = this.loadSearchPluginItems(config);

        setInterval((): void => {
            this.items = this.loadSearchPluginItems(config);
        }, this.rescanIntervalinMilliseconds);
    }

    public getSearchResult(userInput: string): SearchResultItem[] {
        const searchEngine = new SearchEngine(this.items);
        return searchEngine.search(userInput);
    }

    private loadSearchPluginItems(config: ConfigOptions): SearchResultItem[] {
        const plugins = new SearchPluginManager(config).getPlugins();

        const result = plugins.map((plugin) => plugin.getAllItems())
            .reduce((acc, pluginItems) => acc.concat(pluginItems));

        return result;
    }
}
