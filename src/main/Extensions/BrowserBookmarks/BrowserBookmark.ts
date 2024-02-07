import type { SearchResultItem } from "@common/Core";

export interface BrowserBookmark {
    toSearchResultItem(...args: unknown[]): SearchResultItem;
}
