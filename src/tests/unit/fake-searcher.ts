import { Searcher } from "../../ts/searcher/searcher";
import { SearchResultItem } from "../../ts/search-result-item";

export class FakeSearcher implements Searcher {
    public readonly blockOthers: boolean;

    private readonly searchResultItems: SearchResultItem[];

    constructor(shouldBlockOthers: boolean, searchResultItems: SearchResultItem[]) {
        this.blockOthers = shouldBlockOthers;
        this.searchResultItems = searchResultItems;
    }

    public getSearchResult(userInput: string): SearchResultItem[] {
        return this.searchResultItems;
    }
}
