import { SearchEngine, SearchResultItem } from "./search-engine";
import { SearchPluginManager } from "./search-plugin-manager";
import { WebUrlExecutor } from "./executors/web-url-executor";

export class InputValidationService {
    private searchEngine: SearchEngine;
    private webUrlExecutor: WebUrlExecutor;

    constructor() {
        this.webUrlExecutor = new WebUrlExecutor();
        this.searchEngine = new SearchEngine(new SearchPluginManager().getPlugins());
    }

    public getSearchResult(userInput: string): SearchResultItem[] {
        if (this.webUrlExecutor.isValidForExecution(userInput)) {
            return this.handleUrlSearchResult(userInput);
        }
        else {
            return this.handleSearchEngineResult(userInput);
        }
    }

    private handleUrlSearchResult(userInput): SearchResultItem[] {
        return this.webUrlExecutor.getSearchResult(userInput);
    }

    private handleSearchEngineResult(userInput: string): SearchResultItem[] {
        return this.searchEngine.search(userInput);
    }
}