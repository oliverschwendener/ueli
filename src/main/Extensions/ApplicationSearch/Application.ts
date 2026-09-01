import type { SearchResultItem } from "@shared/Core";

export interface Application {
    getId(): string;
    toSearchResultItem(): SearchResultItem;
}
