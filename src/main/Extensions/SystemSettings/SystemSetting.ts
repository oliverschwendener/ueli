import type { SearchResultItem } from "@common/Core";

export interface SystemSetting {
    toSearchResultItem(): SearchResultItem;
}
