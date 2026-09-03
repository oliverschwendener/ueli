import type { SearchResultItem } from "@Shared/Core";

export interface Application {
    getId(): string;
    toSearchResultItem(): SearchResultItem;
}
