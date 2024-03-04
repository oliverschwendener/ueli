import type { SearchResultItem } from "@common/Core";

export interface SystemCommand {
    toSearchResultItem(): SearchResultItem;
}
