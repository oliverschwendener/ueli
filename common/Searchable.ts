import type { SearchResultItem } from "./SearchResultItem";

export interface Searchable {
    toSearchResultItem(): SearchResultItem;
}
