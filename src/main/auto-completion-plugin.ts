import { SearchResultItem } from "../common/search-result-item";
import { AutoCompletionResult } from "../common/auto-completion-result";

export interface AutoCompletionPlugin {
    autoComplete(searchResultItem: SearchResultItem): Promise<AutoCompletionResult>;
}
