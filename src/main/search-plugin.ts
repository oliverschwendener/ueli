import { SearchResultItem } from "../common/search-result-item";
import { UeliPlugin } from "./ueli-plugin";

export interface SearchPlugin extends UeliPlugin {
    getAll(): Promise<SearchResultItem[]>;
    refreshIndex(): Promise<void>;
    clearCache(): Promise<void>;
}
