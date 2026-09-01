import type { SearchResultItem } from "@shared/Core";

export interface SystemSetting {
    toSearchResultItem(): SearchResultItem;
}
