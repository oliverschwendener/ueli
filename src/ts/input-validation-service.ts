import { SearchEngine, SearchResultItem } from "./search-engine";
import { SearchPluginManager } from "./search-plugin-manager";

export class InputValidationService {
    private searchEngine: SearchEngine;

    constructor() {
        let searchPluginManager = new SearchPluginManager();
        let searchPlugins = searchPluginManager.getPlugins();
        this.searchEngine = new SearchEngine(searchPlugins);
    }

    public getSearchResult(userInput: string): SearchResultItem[] {
        return this.searchEngine.search(userInput);
    }
}