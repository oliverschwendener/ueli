import type { SearchResultItem } from "@common/Core";

export interface SearchIndex {
    getSearchResultItems(): SearchResultItem[];
    addSearchResultItems(extensionId: string, searchResultItems: SearchResultItem[]): void;
    removeSearchResultItems(extensionId: string): void;
}
