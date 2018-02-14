import { SearchResultItem } from "../search-engine";

export interface Searcher {
    getSearchResult(userInput: string): SearchResultItem[];
}