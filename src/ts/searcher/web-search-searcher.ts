import { SearchResultItem } from "../search-result-item";
import { WebSearch } from "../web-search";
import { Searcher } from "./searcher";
import { NoWebSearchErrorFoundError } from "../errors/no-websearch-found-error";
import { WebSearchHelpers } from "../helpers/web-search-helper";
import { defaultConfig } from "../default-config";
import { WebSearchBuilder } from "../builders/web-search-builder";

export class WebSearchSearcher implements Searcher {
    private webSearches: WebSearch[];

    constructor(webSearches: WebSearch[]) {
        this.webSearches = webSearches;
    }

    public getSearchResult(userInput: string): SearchResultItem[] {
        for (const webSearch of this.webSearches) {
            const prefix = `${webSearch.prefix}${WebSearchHelpers.webSearchSeparator}`;
            if (userInput.startsWith(prefix)) {
                return [WebSearchBuilder.buildSearchResultItem(userInput, webSearch)];
            }
        }

        throw new NoWebSearchErrorFoundError(userInput);
    }
}
