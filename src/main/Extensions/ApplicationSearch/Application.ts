import type { SearchResultItem } from "@common/Core";

export interface Application {
    getId(): string;
    toSearchResultItem(): SearchResultItem;
}
