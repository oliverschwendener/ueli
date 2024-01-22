import type { ExcludedSearchResultItem } from "@common/Core";

export interface ExcludedSearchResults {
    addItem(item: ExcludedSearchResultItem): Promise<void>;
    removeItem(itemId: string): Promise<void>;
    getExcludedItems(): ExcludedSearchResultItem[];
}
