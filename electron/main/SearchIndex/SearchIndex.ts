import { SearchResultItem } from "@common/SearchResultItem";

export interface SearchIndex {
    getSearchResultItems(): SearchResultItem[];
    addSearchResultItems(pluginId: string, searchResultItems: SearchResultItem[]): void;
}
