import { SearchResultItem } from "../common/search-result-item";
import { UeliPlugin } from "./ueli-plugin";

export interface ExecutionPlugin extends UeliPlugin {
    isValidUserInput(userInput: string): boolean;
    getSearchResults(userInput: string): Promise<SearchResultItem[]>;
}
