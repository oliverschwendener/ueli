import { SearchEngine, SearchResultItem } from "./search-engine";
import { SearchPluginManager } from "./search-plugin-manager";

export class InputValidationService {
    private searchEngine: SearchEngine;

    constructor() {
        this.searchEngine = new SearchEngine(new SearchPluginManager().getPlugins());
    }

    public getSearchResult(userInput: string): SearchResultItem[] {
        return this.searchEngine.search(userInput);
    }
}