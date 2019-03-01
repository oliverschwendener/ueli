import { SearchResultItem } from "../common/search-result-item";
import { UeliPlugin } from "./ueli-plugin";

export interface ExecutionPlugin extends UeliPlugin {
    isValidUserInput(userInput: string, fallback?: boolean): boolean;
    getSearchResults(userInput: string, fallback?: boolean): Promise<SearchResultItem[]>;
}
