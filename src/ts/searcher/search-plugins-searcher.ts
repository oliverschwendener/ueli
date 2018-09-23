import { TimeHelpers } from "../helpers/time-helpers";
import { SearchEngine } from "../search-engine";
import { SearchPluginManager } from "../search-plugin-manager";
import { SearchResultItem } from "../search-result-item";
import { Searcher } from "./searcher";
import { defaultConfig } from "../default-config";
import { UserConfigOptions } from "../user-config/user-config-options";
import { CountManager } from "../count/count-manager";
import { IconSet } from "../icon-sets/icon-set";

export class SearchPluginsSearcher implements Searcher {
    private items: SearchResultItem[];
    private countManager: CountManager;
    private config: UserConfigOptions;
    private rescanIntervalinMilliseconds = TimeHelpers.convertSecondsToMilliseconds(defaultConfig.rescanInterval);

    constructor(config: UserConfigOptions, countManager: CountManager, iconSet: IconSet, environmentVariableCollection: { [key: string]: string }) {
        this.config = config;
        this.countManager = countManager;

        this.items = this.loadSearchPluginItems(config, iconSet, environmentVariableCollection);

        setInterval((): void => {
            this.items = this.loadSearchPluginItems(config, iconSet, environmentVariableCollection);
        }, this.rescanIntervalinMilliseconds);
    }

    public getSearchResult(userInput: string): SearchResultItem[] {
        const searchEngine = new SearchEngine(this.items, this.config.searchEngineThreshold);
        return searchEngine.search(userInput, this.countManager);
    }

    private loadSearchPluginItems(config: UserConfigOptions, iconSet: IconSet, environmentVariableCollection: { [key: string]: string }): SearchResultItem[] {
        const plugins = new SearchPluginManager(config, iconSet, environmentVariableCollection).getPlugins();

        const result = plugins.map((plugin) => plugin.getAllItems())
            .reduce((acc, pluginItems) => acc.concat(pluginItems));

        return result;
    }
}
