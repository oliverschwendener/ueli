import type { SearchResultItem } from "@common/Core";

/**
 * Offers methods to interact with the search index.
 */
export interface SearchIndex {
    /**
     * Gets all search result items in a flat list.
     */
    getSearchResultItems(): SearchResultItem[];

    /**
     * Adds search result items to the search index, grouped by extension ID.
     * @param extensionId The ID of the extension that provides the search result items.
     * @param searchResultItems The search result items to add.
     */
    addSearchResultItems(extensionId: string, searchResultItems: SearchResultItem[]): void;

    /**
     * Removes all search result items for the given extension ID.
     * @param extensionId The ID of the extension to remove search result items for.
     */
    removeSearchResultItems(extensionId: string): void;
}
