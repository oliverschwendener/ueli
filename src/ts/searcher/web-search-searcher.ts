import { Searcher } from "./searcher";
import { SearchResultItem } from "../search-engine";
import { Config } from "../config";
import { WebSearch } from "../executors/web-search-executor";

export class WebSearchSearcher implements Searcher {
    private webSearches = Config.webSearches;

    public getSearchResult(userInput: string): SearchResultItem[] {
        for (let webSearch of this.webSearches) {
            let searchTerm = this.createSearchTerm(userInput, webSearch);
            let searchResultItemName = searchTerm.length > 0
                ? `Search ${webSearch.name} for '${searchTerm}'`
                : `Search ${webSearch.name}`;

            return [
                <SearchResultItem>{
                    name: searchResultItemName,
                    executionArgument: this.createExecutionUrl(userInput, webSearch),
                    icon: webSearch.icon,
                    tags: []
                }
            ]
        }

        throw new Error(`No valid web search found for ${userInput}`);
    }

    
    private createSearchTerm(userInput: string, webSearch: WebSearch): string {
        return userInput.replace(`${webSearch.prefix}${Config.webSearchSeparator}`, "");
    }

    private createExecutionUrl(userInput: string, webSearch: WebSearch): string {
        let searchTerm = this.createSearchTerm(userInput, webSearch);
        return `${webSearch.url}${searchTerm}`;
    }
}