import { SearchEngine } from "../search-engine";
import { SearchPluginManager } from "../search-plugin-manager";
import { SearchResultItem } from "../search-result-item";
import { Searcher } from "./searcher";
import { UserConfigOptions } from "../user-config/user-config-options";
import { CountManager } from "../count/count-manager";
import { IconSet } from "../icon-sets/icon-set";

export class SearchPluginsSearcher implements Searcher {
    private readonly items: SearchResultItem[];
    private readonly countManager: CountManager;
    private config: UserConfigOptions;

    constructor(config: UserConfigOptions, countManager: CountManager, iconSet: IconSet, environmentVariableCollection: { [key: string]: string }) {
        this.config = config;
        this.countManager = countManager;

        const searchPluginManager = new SearchPluginManager(config, iconSet, environmentVariableCollection);
        const plugins = searchPluginManager.getPlugins();

        this.items = plugins.length > 0
            ? plugins
                .map((plugin): SearchResultItem[] => plugin.getAllItems())
                .reduce((acc, pluginItems): SearchResultItem[] => acc.concat(pluginItems))
            : [];
    }

    public getSearchResult(userInput: string): SearchResultItem[] {
        const searchEngine = new SearchEngine(this.items, this.config.searchEngineThreshold, this.config.searchEngineLimit);
        return searchEngine.search(userInput, this.countManager);
    }
}
