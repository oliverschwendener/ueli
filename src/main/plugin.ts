import { SearchResultItem } from "../common/search-result-item";

export interface Plugin {
    getAll(): SearchResultItem[];
}
