import { SearchResultItem } from "../search-result-item";
import { WebSearch } from "../web-search";
import { Searcher } from "./searcher";
import { NoWebSearchErrorFoundError } from "../errors/no-websearch-found-error";
import { WebSearchHelpers } from "../helpers/web-search-helper";
import { defaultConfig } from "../default-config";

export class WebSearchSearcher implements Searcher {
    private webSearches: WebSearch[];

    constructor(webSearches: WebSearch[]) {
        this.webSearches = webSearches;
    }

    public getSearchResult(userInput: string): SearchResultItem[] {
        for (const webSearch of this.webSearches) {
            const prefix = `${webSearch.prefix}${WebSearchHelpers.webSearchSeparator}`;
            if (userInput.startsWith(prefix)) {
                const searchTerm = this.createSearchTerm(userInput, webSearch);
                const searchResultItemName = searchTerm.length > 0
                    ? `Search ${webSearch.name} for '${searchTerm}'`
                    : `Search ${webSearch.name}`;

                return [
                    {
                        executionArgument: this.createExecutionUrl(userInput, webSearch),
                        icon: webSearch.icon,
                        name: searchResultItemName,
                        tags: [],
                    } as SearchResultItem,
                ];
            }
        }

        throw new NoWebSearchErrorFoundError(userInput);
    }

    private createSearchTerm(userInput: string, webSearch: WebSearch): string {
        return userInput.replace(`${webSearch.prefix}${WebSearchHelpers.webSearchSeparator}`, "");
    }

    private createExecutionUrl(userInput: string, webSearch: WebSearch): string {
        const searchTerm = this.createSearchTerm(userInput, webSearch);
        return `${webSearch.url}${searchTerm}`;
    }
}
