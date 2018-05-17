import { TimeHelpers } from "../helpers/time-helpers";
import { SearchEngine } from "../search-engine";
import { SearchPluginManager } from "../search-plugin-manager";
import { SearchResultItem } from "../search-result-item";
import { Searcher } from "./searcher";
import { defaultConfig } from "../default-config";
import { ConfigOptions } from "../config-options";
import { CountManager } from "../count-manager";

export class SearchPluginsSearcher implements Searcher {
    private items: SearchResultItem[];
    private countManager: CountManager;
    private config: ConfigOptions;
    private rescanIntervalinMilliseconds = TimeHelpers.convertSecondsToMilliseconds(defaultConfig.rescanInterval);

    constructor(config: ConfigOptions, countManager: CountManager) {
        this.config = config;
        this.countManager = countManager;

        this.items = this.loadSearchPluginItems(config);

        setInterval((): void => {
            this.items = this.loadSearchPluginItems(config);
        }, this.rescanIntervalinMilliseconds);
    }

    public getSearchResult(userInput: string): SearchResultItem[] {
        const searchEngine = new SearchEngine(this.items, this.config.searchEngineThreshold);
        return searchEngine.search(userInput, this.countManager);
    }

    private loadSearchPluginItems(config: ConfigOptions): SearchResultItem[] {
        const plugins = new SearchPluginManager(config).getPlugins();

        const result = plugins.map((plugin) => plugin.getAllItems())
            .reduce((acc, pluginItems) => acc.concat(pluginItems));

        return result;
    }
}
