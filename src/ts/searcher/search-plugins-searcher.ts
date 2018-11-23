import { SearchEngine } from "../search-engine";
import { SearchPluginManager } from "../search-plugin-manager";
import { SearchResultItem } from "../search-result-item";
import { Searcher } from "./searcher";
import { UserConfigOptions } from "../user-config/user-config-options";
import { CountManager } from "../count/count-manager";
import { IconStore } from "../icon-service/icon-store";

export class SearchPluginsSearcher implements Searcher {
    public readonly blockOthers = false;

    private readonly items: SearchResultItem[];
    private readonly countManager: CountManager;
    private readonly config: UserConfigOptions;

    constructor(config: UserConfigOptions, countManager: CountManager, searchPluginManager: SearchPluginManager, iconStore: IconStore) {
        this.config = config;
        this.countManager = countManager;

        const plugins = searchPluginManager.getPlugins();

        this.items = plugins.length > 0
            ? plugins
                .map((plugin): SearchResultItem[] => plugin.getAllItems())
                .reduce((acc, pluginItems): SearchResultItem[] => acc.concat(pluginItems))
            : [];

        iconStore.init(this.items);
    }

    public getSearchResult(userInput: string): SearchResultItem[] {
        const searchEngine = new SearchEngine(this.items, this.config.searchEngineThreshold, this.config.searchEngineLimit);
        return searchEngine.search(userInput, this.countManager);
    }
}
