import type { SearchResultItem } from "@Shared/Core";

export interface SystemSetting {
    toSearchResultItem(): SearchResultItem;
}
