import { SearchResultItem } from "../common/search-result-item";

export interface AutoCompletionPlugin {
    autoComplete(searchResultItem: SearchResultItem): string;
}
