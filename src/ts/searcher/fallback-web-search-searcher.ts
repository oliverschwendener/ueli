import { Searcher } from "./searcher";
import { SearchResultItem } from "../search-result-item";
import { WebSearch } from "../web-search";
import { WebSearchBuilder } from "../builders/web-search-builder";

export class FallbackWebSearchSercher implements Searcher {
    public readonly blockOthers = false;
    private readonly webSearches: WebSearch[];

    constructor(webSearches: WebSearch[]) {
        this.webSearches = webSearches;
    }

    public getSearchResult(userInput: string): SearchResultItem[] {
        const result = [] as SearchResultItem[];
        const fallbackWebSearches = this.webSearches.filter((w) => w.isFallback);
        const sortedFallbackWebSearches = fallbackWebSearches.sort(this.sortByPriority);

        for (const webSearch of sortedFallbackWebSearches) {
            result.push(WebSearchBuilder.buildSearchResultItem(userInput, webSearch));
        }

        return result;
    }

    private sortByPriority(a: WebSearch, b: WebSearch): number {
        if (a.priority < b.priority) {
            return 1;
        } else if (a.priority > b.priority) {
            return -1;
        } else {
            return 0;
        }
    }
}
