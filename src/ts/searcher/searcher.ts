import { SearchResultItem } from "../search-result-item";

export interface Searcher {
    getSearchResult(userInput: string): SearchResultItem[];
}
