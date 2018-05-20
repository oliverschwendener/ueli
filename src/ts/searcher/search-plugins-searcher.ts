import { TimeHelpers } from "../helpers/time-helpers";
import { SearchEngine } from "../search-engine";
import { SearchPluginManager } from "../search-plugin-manager";
import { SearchResultItem } from "../search-result-item";
import { Searcher } from "./searcher";
import { defaultConfig } from "../default-config";
import { ConfigOptions } from "../config-options";
import { CountManager } from "../count-manager";
import { IconManager } from "../icon-manager/icon-manager";

export class SearchPluginsSearcher implements Searcher {
    private items: SearchResultItem[];
    private countManager: CountManager;
    private config: ConfigOptions;
    private rescanIntervalinMilliseconds = TimeHelpers.convertSecondsToMilliseconds(defaultConfig.rescanInterval);

    constructor(config: ConfigOptions, countManager: CountManager, iconManager: IconManager) {
        this.config = config;
        this.countManager = countManager;

        this.items = this.loadSearchPluginItems(config, iconManager);

        setInterval((): void => {
            this.items = this.loadSearchPluginItems(config, iconManager);
        }, this.rescanIntervalinMilliseconds);
    }

    public getSearchResult(userInput: string): SearchResultItem[] {
        const searchEngine = new SearchEngine(this.items, this.config.searchEngineThreshold);
        return searchEngine.search(userInput, this.countManager);
    }

    private loadSearchPluginItems(config: ConfigOptions, iconManager: IconManager): SearchResultItem[] {
        const plugins = new SearchPluginManager(config, iconManager).getPlugins();

        const result = plugins.map((plugin) => plugin.getAllItems())
            .reduce((acc, pluginItems) => acc.concat(pluginItems));

        return result;
    }
}
