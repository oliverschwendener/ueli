import { SearchResultItem } from "../common/search-result-item";

export interface SearchPlugin {
    getAll(): Promise<SearchResultItem[]>;
    refreshIndex(): Promise<void>;
    clearCache(): Promise<void>;
}
