import { SearchResultItem } from "./../search-engine";

export interface SearchPlugin {
    getAllItems(): SearchResultItem[];
}