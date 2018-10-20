import { SearchResultItem } from "../search-result-item";

export interface SearchPlugin {
    getIndexLength(): number;
    getAllItems(): SearchResultItem[];
}
