import { SearchResultItem } from "../common/search-result-item";

export interface SearchPlugin {
    getAll(): Promise<SearchResultItem[]>;
    refreshIndex(): void;
}
