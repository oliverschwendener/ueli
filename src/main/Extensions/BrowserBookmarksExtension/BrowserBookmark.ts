import type { SearchResultItem } from "@common/Core";

export interface BrowserBookmark {
    toSearchResultItem(searchResultStyle: string): SearchResultItem;
}
