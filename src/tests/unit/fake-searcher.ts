import { Searcher } from "../../ts/searcher/searcher";
import { SearchResultItem } from "../../ts/search-result-item";

export class FakeSearcher implements Searcher {
    private searchResultItems: SearchResultItem[];

    constructor(searchResultItems: SearchResultItem[]) {
        this.searchResultItems = searchResultItems;
    }

    public getSearchResult(userInput: string): SearchResultItem[] {
        return this.searchResultItems;
    }
}
