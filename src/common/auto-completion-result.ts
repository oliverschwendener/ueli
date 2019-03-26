import { SearchResultItem } from "./search-result-item";

export interface AutoCompletionResult {
    results: SearchResultItem[];
    updatedUserInput: string;
}
