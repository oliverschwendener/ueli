import { SearchResultItem } from "../search-result-item";

export interface Searcher {
    blockOthers: boolean;
    getSearchResult(userInput: string): SearchResultItem[];
}
