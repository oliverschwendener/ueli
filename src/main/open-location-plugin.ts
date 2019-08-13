import { SearchResultItem } from "../common/search-result-item";

export interface OpenLocationPlugin {
    openLocation(searchResultItem: SearchResultItem): Promise<void>;
}
