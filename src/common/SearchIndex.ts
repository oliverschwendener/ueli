import type { SearchResultItem } from "./SearchResultItem";

export interface SearchIndex {
    getSearchResultItems(): SearchResultItem[];
    addSearchResultItems(pluginId: string, searchResultItems: SearchResultItem[]): void;
    removeSearchResultItems(pluginId: string): void;
}
